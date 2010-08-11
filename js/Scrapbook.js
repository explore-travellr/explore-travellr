var Scrapbook = new Class({

    Implements: [Events, Options],

    folderFx: null,
    folders: [],

    container: null,

    visible: false,
    foldersVisible: false,

    draggables: [],

    options: {
        button: null,
        folderDropdown: null,
        folderWrapper: null,
        folderFx: { duration: 400, wrapper: 'favourites_wrapper'  }
    },

    persistant: null,

    initialize: function(options) {
        this.setOptions(options);

        var name = 'Scrapbook';

        this.persistant = new Persist.Store(name);
        this.persistant.get(name, (function(ok, data) {
            if (ok && data != null) {
                // Unserializing the data may fail
                try {
                    var folders = Serializable.unserialize(JSON.decode(data), [null, this]);
                    folders.each(function(folder) {
                        this.addFolder(folder);
                    }, this);
                } catch (err) {
                    this.folders = null;
                }
            }

            // If nothing was loaded, make a default thing
            if (this.folders == null || this.folders.length == 0) {
                this.folders = [];
                this.addFolder(new Scrapbook.Folder("Favorites", null, this));
            }
        }).bind(this));

        this.container = new Container('scrapbook');

        this.folderFx = new Fx.Slide(this.options.folderDropdown, this.options.folderFx).hide();

        this.getButton().addEvent('click', (function(event) {
            event.preventDefault();
            if (this.isFoldersVisible()) {
                this.hideFolders();
            } else {
                this.showFolders();
            }
        }).bind(this));
    },

    addItem: function() {
        var folder = this.folders[0];
        folder.addItem.apply(folder, arguments);
    },

    removeItem: function(item) {
        this.folders.each(function(folder) {
            folder.remove(item);
        });
    },

    addFolder: function(folder) {
        this.folders.push(folder);

        this.options.folderWrapper.grab(folder);

        folder.addEvent('dirty', (function() {
            this.save();
        }).bind(this));
    },

    removeFolder: function(folder) {
        this.folders.erase(folder);
        this.options.folderWrapper.removeChild(folder);
    },

    getFolders: function() {
        return this.folders;
    },

    showFolders: function() {
        this.foldersVisible = true;
        this.folderFx.cancel().slideIn();
    },
    hideFolders: function() {
        this.foldersVisible = false;
        this.folderFx.cancel().slideOut();
    },

    addDraggable: function(draggable, options) {
        var droppables = this.getFolders().map(function(folder) {
            return folder.toElement();
        });

        this.draggables.push(new Drag.Move(draggable, $extend(options, {
            droppables: droppables,
            preventDefault: true,
            stopPropagation: true,

            onStart: (function(draggable) {
                this.showFolders();
                draggable.setStyle('z-index', 1000);
            }).bindWithEvent(this),

            onDrop: (function(draggable, droppable, event) {
                event.stop();

                this.hideFolders();
                if (droppable) {
                    droppable.addItem(this.getFeedItem());
                }

                draggable.setStyle('z-index', null);
                new Fx.Morph(draggable).start({left:0, top:0});
            }).bindWithEvent(this)

        })));
    },

    /**
     * Function: updateDraggables
     *
     * Updates all the draggables to reflect a change in the droppables
     */
    updateDraggables: function() {
    },

    getButton: function() {
       return this.options.button;
    },

    save: function() {
        var serialized = [];
        this.folders.each(function(folder) {
            serialized.push(Serializable.serialize(folder));
        });
        this.persistant.set(name, JSON.encode(serialized));
    },

    isVisible: function() {
        return this.visible;
    },

    isFoldersVisible: function() {
        return this.foldersVisible;
    },

    show: function() {
        this.container.show();
        this.folders[0].view(this.container);
        this.visible = true;
        this.fireEvent('shown');
    },

    hide: function() {
        this.container.hide();
        this.visible = false;
        this.fireEvent('hidden');
    }

});

Scrapbook.Folder = new Class({

    Implements: [Events, Options],
    Serializable: 'Scrapbook.Folder',

    parent: null,
    name: null,
    items: [],

    /**
     * Variable: serialized
     * An object contaning this item in a serialized state
     */
    serialized: [],

    /**
     * Variable: dirty
     * A boolean, representing if this item has been modified since it was last saved
     */
    dirty: false,

    /**
     * Constructor: initialize
     * Creates a new folder.
     *
     * Paramaters
     *     name - The name of the folder
     *     parent - The parent folder
     *     scrapbook - The scrapbook that manages this heirachy
     */
    initialize: function(name, parent, scrapbook) {
        this.name = name;
        this.parent = parent;
        this.scrapbook = scrapbook;
        this.displayBox = new Scrapbook.Folder.DisplayBox(this);
    },

    view: function(container) {
        this.container = container;
        this.container.removeAllDisplayBoxes();
        this.getItems().each(function(item) {
            container.addDisplayBox(item.toDisplayBox());
        });
    }, 

    toElement: function() {
        return new Element('div', {text: this.getName()});
    },

    toDisplayBox: function() {
        return this.displayBox;
    },

    /**
     * Function: getItems
     * Return an <JS::Array> of all items in this folder
     *
     * Returns:
     *      An <JS::Array> of items in this folder
     */
    getItems: function() {
        return this.items;
    },

    addItem: function(item) {
        // Listen for a change on the item
        item.addEvent('dirty', (function() {
            this.setDirty(true);
        }).bind(this));

        // Add the item
        this.items.push(item);
        this.setDirty(true);
    },

    removeItem: function(item) {
        this.items.remove(item);
        this.setDirty(true);
    },

    getDirty: function() {
        return this.dirty;
    },

    setDirty: function(dirty) {
        this.dirty = dirty;
        if (this.dirty) {
            this.fireEvent('dirty');
        }
    },

    getName: function() {
        return this.name;
    },

    setName: function(name) {
        this.name = name;
        this.setDirty(true);
    },

    getPath: function() {
        return this.parent.getPath() + '.' + this.getName();
    },

    /**
     * Return an object representing this folder in a serialized state
     */
    serialize: function() {
        if (this.getDirty()) {
            var name = this.getName();
            var items = [];

            this.items.each(function(item) {
                items.push(Serializable.serialize(item));
            });

            this.serialized = {
                name: name,
                items: items
            };
            this.dirty = false;
        }

        return this.serialized;
    }

});
/**
 * Unserialize a <Scrapbook.Folder> from an object.
 *
 * Paramaters:
 *      data - The <Folders> data.
 *      parent - The <Folders> parent. Either another <Folder> or null.
 *      scrapbook - The <Scrapbook> managing this <Folder>.
 *
 * Returns:
 *      A <Scrapbook.Folder>, identical to the one that was serialized initially.
 */
Scrapbook.Folder.unserialize = function(data, parent, scrapbook) {
    var folder = new Scrapbook.Folder(data.name, parent, scrapbook);
    data.items.each(function(item) {
        folder.addItem(Serializable.unserialize(item));
    });
    return folder;
};

Scrapbook.Folder.DisplayBox = new Class({
    folder: null,
    preview: null,
    initialize: function(folder) {
        this.folder = folder;
    },

    getPreview: function() {
        if (!this.preview) {

            var wrapper = new Element('div', {
                text: this.folder.getName(),
                styles: {
                    width: 50
                },
                'class': 'displayBox folder'
            });

            wrapper.addEvent('click', (function() {
                this.fireEvent('click');
            }).bind(this));

            this.preview = wrapper;
        }
        return this.preview;
    }
});
