var Scrapbook = new Class({

    Implements: [Events],

    root: null,

    container: null,

    initialize: function() {
        var name = 'Scrapbook';
        var persistant = new Persist.Store(name);

        persistant.get(name, function(data) {
            if (data == null || data == "") {
                console.log("No old state, making new scrapbook");
                this.root = new Scrapbook.Folder("Root", null, this);
            } else {
                console.log("Loading old state");
                this.root = Scrapbook.Folder.unserialize(JSON.decode(data));
            }

            this.root.addEvent('dirty', function() {
                var serialized = this.serialize();
                var serializedJSON = JSON.encode(serialized);
                console.log("Saving: ", serializedJSON)
                persistant.set(name, serialized);
            });

        });

        this.container = new Container('scrapbook');
    },

    addItem: function() {
        this.root.addItem.apply(this.root, arguments);
    }

});

Scrapbook.Folder = new Class({

    Implements: [Events, Options],

    parent: null,
    name: null,
    items: [],

    /**
     * Variable: container
     * A <Container> that is used to display the contents of this folder
     */
    container: null,

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
        console.log(item);
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
                console.log(item);
                items.push(item.serialize());
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
