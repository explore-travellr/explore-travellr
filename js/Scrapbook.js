/**
 * Class: Scrapbook
 * The <Scrapbook> class allows users to save <FeedItems>, so they can come back to them later.
 * It uses HTML5 storage, flash storage, or cookies to save item. This is done through the use
 * of the <PersistJS> class.
 *
 * Items can be saved into Folders, and users can have as many folders as they want.
 *
 * License:
 *     MIT-style license.
 * 
 * Copyright:
 *     Copyright (c) 2010 explore.travellr.com
 * 
 * Dependencies:
 *    - <MooTools::core> 1.2.4 or higher
 *    - <MooTools::more> 1.2.4.4 RC1 or higher
 *    - <PersistJS>
 *    - <FeedItem>
 *    - <Scrapbook.Folders>
 */
var Scrapbook = new Class({

    Implements: [Events, Options],

	/**
	 * Variable: folderFx
	 * The Fx instance that animates the folder dropdown
	 */
    folderFx: null,

	/**
	 * Variable: folders
	 * An array of <Scrapbook.Folders> the <Scrapbook> contains
	 */
    folders: [],

	/**
	 * Variable: container
	 * The <Container> the <Scrapbook> displays its contents in
	 */
    container: null,

	/**
	 * Variable: visible
	 * If the <Scrapbook> is visible or not
	 */
    visible: false,

	/**
	 * Variable: visibleFolder
	 * The <Scrapbook.Folder> that is currently visible.
	 */
    visibleFolder: null,

	/**
	 * Variable: foldersVisible
	 * If the folder dropdown is currently visible
	 */
    foldersVisible: false,

	/**
	 * Variable: draggables
	 * An array of Drag.Move instances that control the dragging of <FeedItems>
	 */
    draggables: [],

	/**
	 * Variable: draggableElements
	 * An array of configurations for recreating the Drag.Moves
	 */
    draggableElements: [],

	/**
	 * Variable: options
	 * Options to modify the instance with at creation time.
	 * Available options include:
	 * 	button - The Element to show/hide the <Scrapbook> with
	 * 	folderDropdown - The Element that drops down to show the folders
	 * 	folderWrapper - The Element to place the folders in to
	 * 	folderAdd - The Element used to add a folder
	 * 	folderFx - The Fx parameters used to animate the folder dropdown
	 */
    options: {
        button: null,
        folderDropdown: null,
        folderWrapper: null,
        folderAdd: null,
        folderFx: { duration: 400, wrapper: 'favourites_wrapper'  }
    },

	/**
	 * Variable: persistant
	 * The instance of persistant storage
	 */
    persistant: null,

	/**
	 * Variable: name
	 * The name of this class, for saving to persistant storage
	 */
    name: 'Scrapbook',

	/**
	 * Constructor: initialize
	 * Create a new <Scrapbook> using the options supplied
	 *
	 * Parameters:
	 * 	options - A has of options for this instance. See <options>
	 */
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
                this.addFolder(new Scrapbook.Folder({title: "Favourites", scrapbook: this, canDelete: false}));
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
		
		$('back-to-results').addEvent('click', (function(event){
			this.hide();
			this.hideFolders();
			$('back-to-results').addClass('invisible');
		}).bind(this));
		
    },

	/**
	 * Function: addItem
	 * Add an item to the first available folder.
	 * See <Scrapbook.Folder.addItem> for arguments.
	 */
    addItem: function() {
        var folder = this.folders[0];
        folder.addItem.apply(folder, arguments);
    },

	/**
	 * Function: removeItem
	 * Remove an item from all folders
	 * Parameters:
	 * 	item - The item to remove
	 */
    removeItem: function(item) {
        this.folders.each(function(folder) {
            folder.removeItem(item);
        });
    },

	/**
	 * Function: hasItem
	 * Tests for the existance of an item in the <Scrapbook>.
	 *
	 * Parameters:
	 * 	item - The item to search for
	 *
	 * Returns:
	 * True if the item is found, false otherwise
	 */
    hasItem: function(item) {
        return this.folders.some(function(folder) {
            return folder.hasItem(item);
        });
    },

	/**
	 * Function: addFolder
	 * Add a given folder to the <Scrapbook>
	 *
	 * Parameters:
	 *  folder - The <Scrapbook.Folder> to add.
	 */
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

	/**
	 * Function: removeFolder
	 * Removes the given folder from the <Scrapbook>
	 *
	 * Parameters:
	 * 	folder - The <Scrapbook.Folder> to remove
	 */
    removeFolder: function(folder) {
        if (folder != this.folders[0]) {
            this.folders.erase(folder);
            this.options.folderWrapper.removeChild($(folder));
        }
        this.save();
    },

	/**
	 * Function: getFolders
	 * Returns an array of all the <Scrapbook.Folder> this <Scrapbook> contains
	 */
    getFolders: function() {
        return this.folders;
    },

	/**
	 * Function: showFolders
	 * Show the folder dropdown
	 */
    showFolders: function() {
        this.foldersVisible = true;
        this.folderFx.cancel().slideIn();
		this.show_drop_text();
        $('favourites_button').addClass('active');
    },

	/**
	 * Function: hideFolders
	 * Hide the folder dropdown
	 */
    hideFolders: function() {
        this.foldersVisible = false;
        this.folderFx.cancel().slideOut();
		this.show_drag_text();
        $('favourites_button').removeClass('active');
        $('back-to-results').addClass('invisible');
    },

	/**
	 * Function: addDraggable
	 * Add a draggable Element ready to be added to the <Scrapbook>
	 *
	 * Parameters:
	 * 	draggable - The Element to be dragged
	 * 	options - The options to supply to the Drag.Move instance
	 * 	feedItem - The <FeedItem> this item belongs to
	 */
    addDraggable: function(draggable, options, feedItem) {
        var droppables = this.getFolders().map(function(folder) {
            return $(folder);
        });

        var drag = {draggable: draggable, options: options, feedItem: feedItem};
        this.draggableElements.push(drag);
        this._addDraggable(drag, droppables);
    },

	/**
	 * Function: _addDraggable
	 * Create a Drag.Move instance. Only called from <addDraggable> and <updateDraggables>
	 *
	 * Parameters:
	 * 	drag - The options hash created in addDraggable
	 * 	droppables - The droppable targets, ie <Scrapbook.Folders>
	 */
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

	/**
	 * Function: getButton
	 * Get the show/hide button
	 */
    getButton: function() {
       return this.options.button;
    },

	/**
	 * Function: save
	 * Save the contents of the <Scrapbook> to persistant storage
	 */
    save: function() {
        var serialized = [];
        this.folders.each(function(folder) {
            serialized.push(Serializable.serialize(folder));
        });
        this.persistant.set(this.name, JSON.encode(serialized));
    },

	/**
	 * Function: isVisible
	 * Returns the visibility of the <Scrapbook>
	 *
	 * Returns:
	 * The visibility of the <Scrapbook>
	 */
    isVisible: function() {
        return this.visible;
    },

	/**
	 * Function: isFoldersVisible
	 * Returns the visibility of the folders dropdown
	 *
	 * Returns:
	 * The visibility of the folders dropdown
	 */
    isFoldersVisible: function() {
        return this.foldersVisible;
    },

	/**
	 * Function: show
	 * Shows the <Scrapbook.Folder> in the <Scrapbooks> <container>
	 *
	 * Parameters:
	 * 	folder - The <Scrapbook.Folder> to show
	 */
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

	/**
	 * Function: hide
	 * Hides the <Scrapbook> and the folder dropdown.
	 */
    hide: function() {
        this.container.hide();
        if (this.isVisible()) {
            $(this.visibleFolder).removeClass('activeFolder');
        }
        this.visible = false;
        this.getButton().removeClass('active');
        this.fireEvent('hidden');
    },

	/**
	 * Function: getDisplayBoxButtons
	 * Get the buttons to put in a <DisplayBox>. See <DisplayBox.showContent>
	 *
	 * Parameters:
	 * 	options - A hash of options to work with creating buttons
	 */
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
	
	/**
	 * Function: show_drop_text
	 * Shows the 'drop here' help text
	 */
	show_drop_text: function() {
		$('favourites_text').removeClass('drag-text');
		$('favourites_text').addClass('drop-text');
	},
	
	/**
	 * Function: show_drag_text
	 * Shows the 'drag items' help text
	 */
	show_drag_text: function() {
		$('favourites_text').removeClass('drop-text');
		$('favourites_text').addClass('drag-text');
	}

});

/**
 * Class: Scrapbook.Folder
 * The <Scrapbook.Folder> is where <FeedItems> are actually stored in the <Scrapbook>. This class
 * is responsible for storing, displaying and saving the individual <FeedItems>.
 *
 * License:
 *     MIT-style license.
 * 
 * Copyright:
 *     Copyright (c) 2010 explore.travellr.com
 * 
 * Dependencies:
 *    - <MooTools::core> 1.2.4 or higher
 *    - <MooTools::more> 1.2.4.4 RC1 or higher
 *    - <FeedItem>
 *    - <Scrapbook>
 */
Scrapbook.Folder = new Class({

    Implements: [Events, Options],
    Serializable: 'Scrapbook.Folder',

	/**
	 * Variable: title
	 * The title for this folder, as used in the GUI
	 */
    title: null,

	/**
	 * Variable: items
	 * An array of items in the folder
	 */
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
     *     scrapbook - The scrapbook that manages this heirachy
     */
    initialize: function(options) {
        this.scrapbook = options.scrapbook;
        delete options.scrapbook;

        this.setOptions(options);

        this.title = options.title;

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
		$('back-to-results').removeClass('invisible');
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
        this.shown = false;
		this.container = null;
    },

	/**
	 * Function: toElement
	 * Automagically used to cast this instance to an Element
	 */
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

	/**
	 * Function: getDirty
	 * Returns the dirty status of this instance
	 */
    getDirty: function() {
        return this.dirty;
    },

	/**
	 * Function: setDirty
	 * Sets the <dirty> status of this instance, as well as firing
	 * off 'dirty' events if needed
	 */
    setDirty: function(dirty) {
        var fire = !this.dirty && dirty;
        this.dirty = dirty;

        if (fire) {
            this.fireEvent('dirty');
        }
    },

	/**
	 * Function: getTitle
	 * Returns the <title> of this instance
	 */
    getTitle: function() {
        return this.title;
    },

	/**
	 * Function: setTitle
	 * Sets the title of this instance
	 */
    setTitle: function(title) {
        this.title = title;
        this.setDirty(true);
    },

    /**
	 * Function: serialize
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
