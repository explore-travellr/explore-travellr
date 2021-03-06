/*
Class: Container
   Displays and lays out a collection of <DisplayBoxes>

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - <MooTools::core> 1.2.4 or higher
   - <MooTools::more> 1.2.4.4 RC1 or higher

See Also:
   - <DisplayBox>
*/

var Container = new Class({

    /**
     * Variable: firstSearch
     * True if the first search has not happened yet. This can be used to clean up
     * various elements displayed initially, that need to be removed later, for example
     */
    firstSearch: true,

    /**
    * Variable: container
    * The <MooTools::Element> that this <Container> displays its <DisplayBoxes> in
    */
    container: null,

    /**
    * Variable: displayBoxes
    * An <JS::Array> of all the <DisplayBoxes> currently displayed
    */
    displayBoxes: [],

    /**
    * Variable: feeds
    * An <JS::Array> of all the <Feeds> displayed by this <Container>
    */
    feeds: [],

    /**
    * Variable: toggleBox
    * The <FeedToggle> that controlls all the <Feeds> held in <feeds>
    */
    toggleBox: null,

    /**
     * Variable: loaded
     * If all the feeds are loaded
     */
    loaded: false,

    /**
     * Variable: feedsWithContent
     * An array of all the <Feeds> that have content to be displayed
     */
    feedsWithContent: [],

    /**
     * Variable: progressBar
     * An instance of <MoogressBar> showing the loading progress
     */
    progressBar: null,

    /**
     * Variable: progressElement
     * The <JS::Element> the <progressBar> is using for display
     */
    progressElement: null,

    /**
     * Variable: numScreens
     * The number of screens of content to show at a time
     */
    numScreens: null,

    /**
     * Variable: showMore
     * The 'showMore' button
     */
    showMore: null,

    /**
     * Constructor: initialize
     * Creates a new Container class. This instance will layout its DisplayBoxes
     * in the supplied container element. The container will listen to the
     * search box, emptying itself out when a seach is made
     *
     * Parameters:
     *     container - The element to layout the DisplayBoxes in
     *     searchBox - The SearchBox that will create searches for the feeds in this container.
     */
    initialize: function (container, searchBox, scrapbook) {
        this.container = $(container);
        this.masonry = this.container.masonry({
            columnWidth: 100,
            itemSelector: '.displayBox'
        });

        // This function is used as an event callback, so needs to be bound
        this.feedReady = this.feedReady.bindWithEvent(this);
        this.scrapbook = scrapbook;


        this.searchBox = searchBox;
        if (this.searchBox) {

            var mapFeedItem = new MapFeedItem(this.searchBox);
            // Load more on scroll
            window.addEvent('scroll', this.getNextFeedItems.bind(this));

            this.searchBox.addEvent('search', (function (searchFilter) {
                this.show();
                this.scrapbook.isVisible() && this.scrapbook.hide();
                this.scrapbook.isFoldersVisible() && this.scrapbook.hideFolders();

                // Reset things for the loading bar
                this.loadedFeeds = 0;
                this.loaded = false;
                this.numberOfFeeds = this.feeds.length;

                // Destroy the old one, if it is still there
                if (this.progressElement) {
                    this.progressElement.destroy();
                    this.progressBar = null;
                }

                // Make a new one
                this.progressElement = new Element('div', { id: 'progressBar' });
                this.progressBar = new MoogressBar(this.progressElement);
                this.container.grab(this.progressElement);

                // Do things on the first search
                if (this.firstSearch) {
    
                    // Adds the map to the container
                    this.addDisplayBox(new DisplayBox(mapFeedItem));

                    //fades out the things shown initially
                    var initial = $$('.initial-display');
                    initial.fade('out');
                    (function() {
                        initial.each(function(el) {
                            el.destroy();
                        });
                    }).delay(1000);

                    $$('.initial-hidden').fade('in');

                    this.firstSearch = false;
                }
                
                // Reset all the feeds
                this.feedsWithContent = [];
                this.feeds.each(function(feed) {
                    feed.removeEvent('feedItemsReady', this.feedReady);
                    feed.addEvent('feedItemsReady', this.feedReady);
                    feed.newSearch(searchFilter);
                    this.feedsWithContent.push(feed);
                }, this);

                // Reset the paging
                this.numScreens = 2;
                this.showMore && this.showMore.destroy();
                this.showMore = null;

                this.getElement().masonry({appendContent: []});

                // Start the process off
                this.getNextFeedItems(true);

            }).bind(this));
        } else {
            this.loaded = true;
        }
    },
	
    /**
     * Function: feedReady
     * Increments the number of feeds that have been loaded, sets the percentage 
	 * of the loading bar and then if loading bar is complete remove the loading bar
     *
     * Parameters:
     *     feed - The feed to add
     */
    feedReady: function(feed) {
        this.loadedFeeds++;//increment loading bar

        if (this.progressBar) {
            this.progressBar.setPercentage(this.loadedFeeds * 100 / this.numberOfFeeds);
        }


        if (this.loadedFeeds == this.numberOfFeeds) {
            //hide loading bar
            this.firstRound = false;
            this.loaded = true;

            this.progressElement.destroy();

            this.progressElement = null;
            this.progressBar = null;

            this.getNextFeedItems();
        }

        feed.removeEvent('feedItemsReady', this.feedReady);
    },
	
    /**
     * Function: getNextFeedItems
     * Adds the show more button at the end of the page and allows for the
	 * application to request more feed items to be added to the page
     *
     * Parameters:
     *     firstRound - true or false for initial search or not
     */
    getNextFeedItems: function(firstRound) {
        if (!this.showMore && (firstRound || this.loaded)) {
            if (!firstRound && window.getScrollSize().y > window.getSize().y * this.numScreens) {
                this.showMore = new Element('div', {
                    'class': 'show-more',
                    text: 'Show more results'
                });
                this.showMore.addEvent('click', (function() {
                    this.numScreens = this.numScreens + 2;
                    this.showMore.destroy();
                    this.showMore = null;
                    this.getNextFeedItems();
                }).bind(this));
                this.container.grab(this.showMore, 'after');
            } else {
                var feeds = this.feedsWithContent;
                this.feedsWithContent = [];
                feeds.each(function(feed) {
                    feed.getNextFeedItem((function(feedItem) {
                        if (feedItem) {
                            if (feed.isVisible()) {
                                this.addDisplayBox(new DisplayBox(feedItem, this.scrapbook));
                                this.feedsWithContent.push(feed);
                                this.getNextFeedItems.delay(100, this);
                            }
                        }
                    }).bind(this));
                }, this);
            }
        }
    },

    /**
     * Function: addFeed
     * Adds a feed to this container
     *
     * Parameters:
     *     feed - The feed to add
     */
    addFeed: function (feed) {
        this.feeds.push(feed);
        feed.addEvents({
            shown: (function() {
                this.feedsWithContent.include(feed);
                this.getNextFeedItems();
            }).bind(this),
            hidden: (function() {
                this.feedsWithContent.erase(feed);
                this.container.masonry({appendContent: []});
                this.getNextFeedItems();
            }).bind(this)
        });
    },

    /**
     * Function: addDisplayBox
     * Adds a <DisplayBox> to the <Containers> <displayBoxQueue>. <DisplayBoxes>
     * will be added in the future at a time decided by the <Container>.
     *
     * Parameters:
     *     displayBox - The <DisplayBox> to add
     *
     * See Also:
     *     - <queueAddDisplayBox>
     */
    addDisplayBox: function (displayBox) {
        // Get the preview to display
        var preview = displayBox.getPreview();

        // Add it to the container
        this.container.grab(preview);
        this.container.masonry({
            appendContent: [preview]
        });

        preview.fade('hide').fade('in');

        // Tell the display box about this container
        displayBox.setContainer(this);
        this.displayBoxes.push(displayBox);

        displayBox.fireEvent('preview');
    },

    /**
     * Function: getDisplayBoxes
     * Get all the DisplayBoxes being managed by this Container
     *
     * Returns:
     *     An array containing the DisplayBoxes in this Container
     */
    getDisplayBoxes: function (feed) {
        return this.displayBoxes;
    },

    /**
     * Function: removeDisplayBox
     * Remove a display box from the Container
     *
     * Parameters:
     *     displayBox - The DisplayBox to remove. If the DisplayBox is not present, this function does nothing.
     */
    removeDisplayBox: function (displayBox) {
        if (!displayBox) { return; }
        displayBox.setContainer(null);
        this.displayBoxes.erase(displayBox);
        this.displayBoxQueue.erase(displayBox);
        if (this.container.hasChild(displayBox.getPreview())) {
            this.container.removeChild(displayBox.getPreview());
        }
    },

    removeAllDisplayBoxes: function () {
        var displayBoxes = this.getDisplayBoxes();
        while (displayBoxes.length) {
            this.removeDisplayBox(displayBoxes[0]);
        }
    },

    /**
     * Function: getElement
     * Get the element that this Container is putting its DisplayBoxes in
     *
     * Returns:
     *     The Element the Container manages
     */
    getElement: function () {
        return this.container;
    },
    /**
     * Function: show
     * Toggles the container and show more button to show
     */
    show: function () {
        this.getElement().setStyle('display', null);
		this.showMore && this.showMore.setStyle('display', null);
        this.container.masonry({appendContent: []});
    },
    /**
     * Function: hide
     * Toggles the container and show more button to hide
     */  
    hide: function () {
        this.getElement().setStyle('display', 'none');
		this.showMore && this.showMore.setStyle('display', 'none');
    }
});

/*
Class: FeedToggle

License:
    MIT-style license.

Copyright:
    Copyright (c) 2010 explore.travellr.com

Dependencies:
   - <MooTools::core> 1.2.4 or higher
   - <MooTools::more> 1.2.4.4 RC1 or higher
*/
var FeedToggle = new Class({

    /**
     * Variable: container
     * The <MooTools::Element> that the <FeedToggle> is displayed in
     */
    container: null,

    /**
     * Constructor: initialize
     * Create a new <FeedToggle> class. It will put the controls for its <Feeds>
     * in the container <MooTools::Element> supplied
     *
     * Parameters:
     *     container - The <MooTools::Element> to put the controls in
     */
    initialize: function(container) {
        this.container = $(container);
    },

    /**
     * Function: addFeed
     * Add a <Feed> to this <FeedToggle>
     *
     * Parameters:
     *     feed - The <Feed> to add to the <FeedToggle>
     */
    addFeed: function(feed) {
        var button = new Element('li', {
            text: feed.name , //+ ' on/off',
            'class': feed.name+ 'feed_toggle'
        });

        button.addEvent('click', function(event) {
            var isVisible = !feed.isVisible();

            feed.setVisible(isVisible);

            if (isVisible) {
                button.removeClass('off');
                button.addClass('on');
            } else {
                button.removeClass('on');
                button.addClass('off');
            }
        });
        this.container.grab(button);
    }
});
