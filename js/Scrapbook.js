var Scrapbook = new Class({

    Implements: [Events, Options],

    folderFx: null,
    folders: [],

    container: null,

    visible: false,
    visibleFolder: null,
    foldersVisible: false,

    draggables: [],
    draggableElements: [],

    options: {
        button: null,
        folderDropdown: null,
        folderWrapper: null,
        folderAdd: null,
        folderFx: { duration: 400, wrapper: 'favourites_wrapper'  }
    },

    persistant: null,
    name: 'Scrapbook',

    initialize: function(options) {
        this.setOptions(options);

        this.container = new Container('scrapbook');

        this.persistant = new Persist.Store(this.name);
        this.persistant.get(this.name, (function(ok, data) {
            if (ok && data !== null) {
                // Unserializing the data may fail
                try {
                    var folders = JSON.decode(data);
                    folders.each(function(folder) {
                        this.addFolder(Serializable.unserialize(folder, [null, this]));
                    }, this);
                } catch (err) {
                    this.folders = null;
                }
            }

            // If nothing was loaded, make a default thing
            if (this.folders === null || this.folders.length === 0) {
                this.folders = [];
                this.addFolder(new Scrapbook.Folder("Favorites", null, this));
            }
        }).bind(this));

        this.folderFx = new Fx.Slide(this.options.folderDropdown, this.options.folderFx).hide();
        
        // Hide the drop down on mouse leave, if its a good thing to do
        this.options.folderDropdown.addEvent('mouseleave', (function() {
            (function() {
                if (!this.isVisible() && !this.dragging) {
                    this.hideFolders();
                }
            }).delay(1000, this)
        }).bind(this));
        this.options.folderAdd.addEvent('click', (function() {
            var name = prompt('Name of new folder');
            if (name) {
                this.addFolder(new Scrapbook.Folder(name, null, this));
            }
        }).bind(this));

        this.getButton().addEvent('click', (function(event) {
            event.preventDefault();
            if (this.isVisible()) {
                this.hide();
                this.hideFolders();
            } else if (this.isFoldersVisible()) {
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
            folder.removeItem(item);
        });
    },

    hasItem: function(item) {
        return this.folders.some(function(folder) {
            return folder.hasItem(item);
        });
    },

    addFolder: function(folder) {
        this.folders.push(folder);

        this.options.folderWrapper.grab(folder);

        folder.addEvent('dirty', (function() {
            this.save();
        }).bind(this));

        folder.toElement().addEvent('click', (function(event) {
            event.stopPropagation();
            this.show(folder);
        }).bind(this));


        this.updateDraggables();
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
        $('favourites_button').addClass('active');
    },
    hideFolders: function() {
        this.foldersVisible = false;
        this.folderFx.cancel().slideOut();
        $('favourites_button').removeClass('active');
    },

    addDraggable: function(draggable, options, feedItem) {
        var droppables = this.getFolders().map(function(folder) {
            return folder.toElement();
        });

        var drag = {draggable: draggable, options: options, feedItem: feedItem};
        this.draggableElements.push(drag);
        this._addDraggable(drag, droppables);
    },

    _addDraggable: function(drag, droppables) {
        this.draggables.push(new Drag.Move(drag.draggable, $extend(drag.options, {
            droppables: droppables,
            preventDefault: true,
            stopPropagation: true,

            onStart: (function(draggable) {
                this.showFolders();
                this.dragging = true;
                draggable.addClass('dragged');
            }).bindWithEvent(this),
            
            onEnter: function(draggable, droppable) {
                droppable.addClass('folderOpen');
            },
            onLeave: function(draggable, droppable) {
                droppable.removeClass('folderOpen');
            },

            onDrop: (function(draggable, droppable, event) {
                this.dragging = false;

                if (event) {
                    event.stop();
                }
                
                if (droppable) {
                    droppable.removeClass('folderOpen');
                    droppable.addClass('activeFolder');

                    (function() {
                        droppable.removeClass('activeFolder');
                    }).delay(500);
                    //droppable.highlight();
                    
                    droppable.retrieve('Scrapbook.Folder').addItem(draggable.retrieve('FeedItem'));
                } else if (!this.isVisible()) {
                    this.hideFolders();
                }
                
                new Fx.Morph(draggable).start({left:0, top:0}).chain(function() {
                    draggable.removeClass('dragged');
                });
                
            }).bindWithEvent(this)

        })));
    },

    /**
     * Function: updateDraggables
     *
     * Updates all the draggables to reflect a change in the droppables
     */
    updateDraggables: function() {
        var droppables = this.getFolders().map(function(folder) {
            return folder.toElement();
        });
        this.draggables.each(function(d) {
            d.detach();
        });
        this.draggableElements.each(function(drag) {
            this._addDraggable(drag, droppables);
        }, this);
    },

    getButton: function() {
       return this.options.button;
    },

    save: function() {
        var serialized = [];
        this.folders.each(function(folder) {
            serialized.push(Serializable.serialize(folder));
        });
        this.persistant.set(this.name, JSON.encode(serialized));
    },

    isVisible: function() {
        return this.visible;
    },

    isFoldersVisible: function() {
        return this.foldersVisible;
    },

    show: function(folder) {
        if (this.isVisible()) {
            this.visibleFolder.toElement().removeClass('activeFolder');
        }
        this.container.show();
        
        folder = (folder || this.folders[0]);
        folder.view(this.container);
        folder.toElement().addClass('activeFolder');

        this.visible = true;
        this.visibleFolder = folder;
        // this.hideFolders();
        this.getButton().addClass('active');
        this.fireEvent('shown');
    },

    hide: function() {
        this.container.hide();
        if (this.isVisible()) {
            this.visibleFolder.toElement().removeClass('activeFolder');
        }
        this.visible = false;
        this.getButton().removeClass('active');
        this.fireEvent('hidden');
    },

    getDisplayBoxButtons: function(options) {
        folder = (this.isVisible() ? this.visibleFolder : this.getFolders()[0]);
        hasFeedItem = folder.hasItem(options.feedItem);

        var scrapbook = new Element('div', { 'class': 'scrapbook-icon icon'});
        if (this.isVisible()) {
            scrapbook.addClass('scrapbook-open');
        }

        var addText = "Add to scrapbook";
        var removeText = "Remove from scrapbook";
        if (!hasFeedItem) {
            scrapbook.set({text: addText, title: addText});
            scrapbook.addClass('scrapbook-add');
        } else {
            scrapbook.set({text: removeText, title: removeText});
            scrapbook.addClass('scrapbook-remove');
        }
        scrapbook.addEvent('click', (function() {
            if (hasFeedItem) {
                folder.removeItem(options.feedItem);
                scrapbook.removeClass('scrapbook-remove');
                scrapbook.addClass('scrapbook-add');
                scrapbook.set({text: removeText, title: removeText});
            } else {
                folder.addItem(options.feedItem);
                scrapbook.removeClass('scrapbook-add');
                scrapbook.addClass('scrapbook-remove');
                scrapbook.set({text: addText, title: addText});
            }
            hasFeedItem = !hasFeedItem;
        }).bind(this));
        return [scrapbook];
    }

});

Scrapbook.Folder = new Class({

    Implements: [Events, Options],
    Serializable: 'Scrapbook.Folder',

    parent: null,
    name: null,
    items: null,

    /**
     * Variable: serialized
     * An object contaning this item in a serialized state
     */
    serialized: null,

    /**
     * Variable: dirty
     * A boolean, representing if this item has been modified since it was last saved
     */
    dirty: false,

    /**
     * Constructor: initialize
     * Creates a new folder.
     *
     * Parameters
     *     name - The name of the folder
     *     parent - The parent folder
     *     scrapbook - The scrapbook that manages this heirachy
     */
    initialize: function(name, parent, scrapbook) {
        this.name = name;
        this.parent = parent;
        this.scrapbook = scrapbook;
        this.displayBox = new Scrapbook.Folder.DisplayBox(this);
        this.items = [];
    },

    view: function(container) {
        this.container = container;
        this.container.removeAllDisplayBoxes();
        this.getItems().each(function(item) {
            container.addDisplayBox(new DisplayBox(item, this.scrapbook));
        }, this);
    }, 

    toElement: function() {
        if (!this.element) {
            this.element = new Element('div', {
                'class': 'folder',
                text: this.getName()
            });
            this.element.store('Scrapbook.Folder', this);
        }
        return this.element;
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

    /**
     * Function: addItem
     * Add an item to a folder
     *
     * Parameters:
     *      item - The item to add to the folder
     */
    addItem: function(item) {
        item = item.clone();
        if (!this.hasItem(item)) {
            // Listen for a change on the item
            item.addEvent('dirty', (function() {
                this.setDirty(true);
            }).bind(this));

            this.toElement().addClass('fullFolder');

            // Add the item
            this.items.push(item);
            this.setDirty(true);
        }
    },

    /**
     * Function: removeItem
     * Remove an item from a folder
     *
     * Parameters:
     *      item - The item to remove from the folder
     */
    removeItem: function(item) {
        var i = this.items.length - 1,
            serialized = JSON.encode(Serializable.serialize(item));
        for (; i >= 0; --i) {
            if (JSON.encode(Serializable.serialize(this.items[i])) == serialized) {
                delete this.items[i];
            }
        }
        this.items = this.items.clean();
        if (!this.items.length) {
            this.toElement().removeClass('fullFolder');
        }
        this.setDirty(true);
    },

    /**
     * Function: hasItem
     * Tests the folder for the presence of an item
     *
     * Parameters:
     *      item - The item to look for
     * 
     * Returns:
     * True if the folder contains the item, false otherwise
     */
    hasItem: function(item) {
        var serialized = JSON.encode(Serializable.serialize(item));
        return this.getItems().some(function(compare) {
            return JSON.encode(Serializable.serialize(compare)) == serialized;
        });
    },

    getDirty: function() {
        return this.dirty;
    },

    setDirty: function(dirty) {
        var fire = !this.dirty && dirty;
        this.dirty = dirty;
        if (fire) {
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
        if (this.getDirty() || !this.serialized) {
            var name = this.getName();
            var serializedItems = [];

            this.items.each(function(item) {
                serializedItems.push(Serializable.serialize(item));
            });

            this.serialized = {
                name: name,
                items: serializedItems
            };
            this.setDirty(false);
        }

        return this.serialized;
    }

});
/**
 * Unserialize a <Scrapbook.Folder> from an object.
 *
 * Parameters:
 *      data - The <Folders> data.
 *      parent - The <Folders> parent. Either another <Folder> or null.
 *      scrapbook - The <Scrapbook> managing this <Folder>.
 *
 * Returns:
 *      A <Scrapbook.Folder>, identical to the one that was serialized initially.
 */
Scrapbook.Folder.unserialize = function(data, parent, scrapbook) {
    var folder = new Scrapbook.Folder(data.name, parent, scrapbook);
    (data.items || []).each(function(item) {
        folder.addItem(Serializable.unserialize(item));
    });
    folder.setDirty(false);
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
