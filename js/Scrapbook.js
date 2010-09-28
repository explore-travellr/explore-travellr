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
        this.container.hide();

        this.persistant = new Persist.Store(this.name);
        this.persistant.get(this.name, (function(ok, data) {
            if (ok && data !== null) {
                // Unserializing the data may fail
                try {
                    var folders = JSON.decode(data);
                    folders.each(function(folder) {
                        this.addFolder(Serializable.unserialize(folder, [{scrapbook: this}]));
                    }, this);
                } catch (err) {
                    this.folders = null;
                }
            }

            // If nothing was loaded, make a default thing
            if (this.folders === null || this.folders.length === 0) {
                this.folders = [];
                this.addFolder(new Scrapbook.Folder({title: "Favorites", scrapbook: this, canDelete: false}));
            }
        }).bind(this));

        this.folderFx = new Fx.Slide(this.options.folderDropdown, this.options.folderFx).hide();
        
        // Hide the drop down on mouse leave, if its a good thing to do
		var closingFolder = null;
        this.options.folderDropdown.addEvents({
			mouseleave: (function() {
				closingFolder = (function() {
					if (!this.isVisible() && !this.dragging && !this.addingFolder) {
						this.hideFolders();
					}
				}).delay(1000, this);
			}).bind(this),
			mouseenter: function() {
				closingFolder && $clear(closingFolder);
				closingFolder = null;
			}
		});
        this.options.folderAdd.addEvent('click', (function(event) {
			event.stop();
			var dialog = new MooDialog.Prompt('Name of new folder?', (function(ret){
				if (ret) {
					this.addFolder(new Scrapbook.Folder({title: ret, scrapbook: this}));
				}
				this.addingFolder = false;
			}).bind(this));
			this.addingFolder = true;
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

        $(folder).addEvent('click', (function(event) {
            event.stopPropagation();
            this.show(folder);
        }).bind(this));


        this.updateDraggables();
    },

    removeFolder: function(folder) {
        if (folder != this.folders[0]) {
            this.folders.erase(folder);
            this.options.folderWrapper.removeChild($(folder));
        }
        this.save();
    },

    getFolders: function() {
        return this.folders;
    },

    showFolders: function() {
        this.foldersVisible = true;
        this.folderFx.cancel().slideIn();
		this.show_drop_text();
        $('favourites_button').addClass('active');
    },
    hideFolders: function() {
        this.foldersVisible = false;
        this.folderFx.cancel().slideOut();
		this.show_drag_text();
        $('favourites_button').removeClass('active');
    },

    addDraggable: function(draggable, options, feedItem) {
        var droppables = this.getFolders().map(function(folder) {
            return $(folder);
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
                drag.draggable.addClass('dragged');
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
            return $(folder);
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
            this.visibleFolder.hide();
        }
        this.container.show();
        
        folder = (folder || this.folders[0]);
        folder.show(this.container);

        this.visible = true;
        this.visibleFolder = folder;
        // this.hideFolders();
        this.getButton().addClass('active');
        this.fireEvent('shown');
    },

    hide: function() {
        this.container.hide();
        if (this.isVisible()) {
            $(this.visibleFolder).removeClass('activeFolder');
        }
        this.visible = false;
        this.getButton().removeClass('active');
        this.fireEvent('hidden');
    },

    getDisplayBoxButtons: function(options) {
        if (!options.feedItem.canScrapbook()) {
          return [];
        }
        folder = (this.isVisible() ? this.visibleFolder : this.getFolders()[0]);
        hasFeedItem = folder.hasItem(options.feedItem);

        var scrapbook = new Element('div', { 'class': 'scrapbook-icon icon'});
        if (this.isVisible()) {
            scrapbook.addClass('scrapbook-open');
        }

        var addText = "add to favourites";
        var removeText = "removed from favourites";
		var addedText = "item in favourites";
		
        if (!hasFeedItem) {
            scrapbook.set({text: addText, title: addText});
            scrapbook.addClass('scrapbook-add');
        } else {
            scrapbook.set({text: addedText, title: removeText});
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
                scrapbook.set({text: addedText, title: addedText});
            }
            hasFeedItem = !hasFeedItem;
        }).bind(this));
        return [scrapbook];
    },
	
	show_drop_text: function() {
		$('favourites_text').removeClass('drag-text');
		$('favourites_text').addClass('drop-text');
	},
	
	show_drag_text: function() {
		$('favourites_text').removeClass('drop-text');
		$('favourites_text').addClass('drag-text');
	}

});

Scrapbook.Folder = new Class({

    Implements: [Events, Options],
    Serializable: 'Scrapbook.Folder',

    parent: null,
    title: null,
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
     * Variable: shown
     * A boolean, representing if this folder is currently visible
     */
    shown: false,

    /**
     * Variable: options
     * Contains default options for folders
     */
    options: {
        title: 'unnamed folder',
        canDelete: true
    },

    /**
     * Constructor: initialize
     * Creates a new folder.
     *
     * Parameters
     *     name - The name of the folder
     *     parent - The parent folder
     *     scrapbook - The scrapbook that manages this heirachy
     */
    initialize: function(options) {
        this.parent = options.parent;
        this.scrapbook = options.scrapbook;
        delete options.parent;
        delete options.scrapbook;

        this.setOptions(options);

        this.title = options.title;

        this.displayBox = new Scrapbook.Folder.DisplayBox(this);
        this.items = [];
    },

    /**
     * Function: show
     * Show the folder and its contents in the <Container>
     *
     * Parameters:
     *      container - The <Container> to show the folder in
     */
    show: function(container) {
        this.container = container;
        this.container.removeAllDisplayBoxes();
        this.shown = true;
        $(this).addClass('activeFolder');
        this.getItems().each(function(item) {
            container.addDisplayBox(new DisplayBox(item, this.scrapbook));
        }, this);
    }, 

    /**
     * Function: hide
     * Called when the folder is hidden
     */
    hide: function() {
        $(this).removeClass('activeFolder');
        this.shown = true;
    },

    toElement: function() {
        if (!this.element) {
            this.element = new Element('div', {
                'class': 'folder',
                text: this.getTitle()
            });
            if (this.options.canDelete) {
                var del = new Element('div', {
                    'class': 'delete',
                    title: 'Delete ' + this.title
                });
                del.addEvent('click', (function(event) {
                    event.stop();
                    this.scrapbook.removeFolder(this);
                }).bind(this));
                this.element.grab(del);
            }
            this.element.store('Scrapbook.Folder', this);
        }
        return this.element;
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
            if (this.shown) {
                this.container.addDisplayBox(new DisplayBox(item, this.scrapbook));
            }
            // Listen for a change on the item
            item.addEvent('dirty', (function() {
                this.setDirty(true);
            }).bind(this));

            $(this).addClass('fullFolder');

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
            serialized = JSON.encode(Serializable.serialize(item)),
            removed = [];
        for (; i >= 0; --i) {
            if (JSON.encode(Serializable.serialize(this.items[i])) == serialized) {
                if (this.shown) {
                    this.container.removeDisplayBox(this.items[i].getDisplayBox());
                    this.container.getElement().masonry({appendContent: []});
                }
                delete this.items[i];
            }
        }
        this.items = this.items.clean();
        if (!this.items.length) {
            $(this).removeClass('fullFolder');
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

    getTitle: function() {
        return this.title;
    },

    setTitle: function(title) {
        this.title = title;
        this.setDirty(true);
    },

    getPath: function() {
        return this.parent.getPath() + '.' + this.getTitle();
    },

    /**
     * Return an object representing this folder in a serialized state
     */
    serialize: function() {
        if (this.getDirty() || !this.serialized) {
            var serializedItems = [];

            this.items.each(function(item) {
                serializedItems.push(Serializable.serialize(item));
            });

            this.serialized = {
                options: {
                    title: this.getTitle(),
                    canDelete: this.options.canDelete
                },
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
Scrapbook.Folder.unserialize = function(data, options) {
    if (!data.options) {
        throw new Error("Old scrapbook contents");
    }
    options = $H(data.options).extend(options);

    var folder = new Scrapbook.Folder(options);
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
                text: this.folder.getTitle(),
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
