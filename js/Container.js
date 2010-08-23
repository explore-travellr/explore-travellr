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
    * Variable: displayBoxQueue
    * A queue (<JS::Array>) of <DisplayBoxes> that will be animated in to the
    * display
    */
    displayBoxQueue: [],

    /**
    * Variable: queueTimer
    * The timer reference for delaying the animation of <displayBoxQueue>
    */
    queueTimer: null,

    /**
    * Variable: queueDelay
    * The time in milliseconds to delay between displaying each <DisplayBox> in
    * in <displayBoxQueue>
    */
    queueDelay: 100,

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
    * Constructor: initialize
    * Creates a new Container class. This instance will layout its DisplayBoxes
    * in the supplied container element. The container will listen to the
    * search box, emptying itself out when a seach is made
    *
    * Parameters:
    *     container - The element to layout the DisplayBoxes in
    *     searchBox - The SearchBox that will create searches for the feeds in this container.
    */
    initialize: function (container, searchBox) {
        this.container = $(container);
        this.masonry = this.container.masonry({
            columnWidth: 100,
            itemSelector: '.displayBox'
        });

        // This function is used as an event callback, so needs to be bound
        this.feedReady = this.feedReady.bind(this);

        this.searchBox = searchBox;
        if (this.searchBox) {
            // Load more on scroll
            window.addEvent('scroll', this.getNextFeedItems.bind(this));

            this.searchBox.addEvent('search', (function (searchFilter) {

                this.loadedFeeds = 0;
                this.loaded = false;
                this.numberOfFeeds = this.feeds.length;

                if (this.progressElement) {
                    this.progressElement.destroy();
                    this.progressBar = null;
                }

                this.progressElement = new Element('div', { id: 'progressBar' })
                this.progressBar = new MoogressBar(this.progressElement);
                this.container.grab(this.progressElement);

                //fades out the tooltip
                $('slogan').fade('out');

                this.feedsWithContent = [];

                this.feeds.each(function(feed) {

                    feed.newSearch(searchFilter);
                    this.feedsWithContent.push(feed);

                }, this);

                this.getNextFeedItems(true);

            }).bind(this));
        } else {
            this.loaded = true;
        }
    },

    feedReady: function() {
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
    },

    getNextFeedItems: function(firstRound) {

        if (firstRound || (this.loaded && window.atBottom(window.getSize().y))) {
            var feeds = this.feedsWithContent;
            this.feedsWithContent = [];
            feeds.each(function(feed) {

                feed.getNextFeedItem((function(feedItem) {
                    (function() {
                        if (feedItem) {
                            this.addDisplayBox(new DisplayBox(feedItem));
                            if (feed.isVisible()) {
                                this.feedsWithContent.push(feed);
                                this.getNextFeedItems();
                            }
                        }
                    }).delay(100, this);
                }).bind(this));

            }, this);
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
            }).bind(this),
            hidden: (function() {
                this.feedsWithContent.erase(feed);
                this.container.masonry({appendContent: []});
                this.getNextFeedItems();
            }).bind(this),
            feedItemsReady: this.feedReady
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
        if (!displayBox) return;
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

    show: function () {
        this.getElement().setStyle('display', null);
        this.container.masonry({appendContent: []});
    },
    hide: function () {
        this.getElement().setStyle('display', 'none');
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

    data: null,

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
