var Scrapbook = new Class({

    Implements: [Events, Options],

    root: null,

    container: null,

    visible: false,

    options: {
        button: null
    },

    initialize: function(options) {
        this.setOptions(options);

        var name = 'Scrapbook';
        var persistant = new Persist.Store(name);

        persistant.get(name, (function(ok, data) {
            if (ok && data != null) {
                // Unserializing the data may fail
                try {
                    this.root = Serializable.unserialize(JSON.decode(data), [null, this]);
                } catch (err) {
                    this.root = null;
                }
            }
            if (this.root == null) {
                this.root = new Scrapbook.Folder("Root", null, this);
            }

            this.root.addEvent('dirty', function() {
                var serialized = Serializable.serialize(this);
                persistant.set(name, JSON.encode(serialized));
            });

        }).bind(this));

        this.container = new Container('scrapbook');
        this.container.hide();

        this.getButton().addEvent('click', (function() {
            if (this.isVisible()) {
                this.hide();
            } else {
                this.show();
            }
        }).bind(this));
    },

    addItem: function() {
        this.root.addItem.apply(this.root, arguments);
    },

    getButton: function() {
       return this.options.button;
    },

    isVisible: function() {
        return this.visible;
    },

    show: function() {
        this.container.show();
        this.root.view(this.container);
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
