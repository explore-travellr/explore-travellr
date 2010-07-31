var Scrapbook = new Class({

    root: null,

    container: null,

    initialize: function() {
        // this.persistant = new Persist.Store();

        this.persistant = new (function() {
            return {
                load: function(name) {
                    var data = prompt("Loading " + data + ". Enter it below");
                    return data || null;
                },
                save: function(name, data) {
                    console.log("Saving", name, ":", data);
                }
            }
        })();

        var oldState = this.persistant.load('Scrapbook');

        if (oldState == null || oldState == "") {
            console.log("No old state, making new scrapbook");
            root = new Scrapbook.Folder("Root", this);
        } else {
            console.log("Loading old state");
            root = Scrapbook.Folder.unserialize(oldState);
        }

        this.container = new Container('#scrapbook');
    },

    addItem: function() {
    },

});

Scrapbook.Folder = new Class({

    parent: null,
    name: null,
    items: null,

    /** Variable: container
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
    dirty: false,

    initialize: function(name, parent, scrapbook) {
        this.name = name;
        this.parent = parent;
        this.scrapbook = scrapbook;
    },

    getItems: function() {
        return this.items;
    },

    addItem: function(item) {
        // Listen for a change on the item
        item.addEvent('dirty', (function() {
            this.setDirty(true);
        });

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
                content.push(item.serialize());
            });

            this.serialized = {
                name: name,
                items: items
            };
        }

        return this.serialized;
    }

});
