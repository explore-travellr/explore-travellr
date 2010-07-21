/*
Script: Container.js
   Container - DESC TODO
   FeedToggle - DESC TODO

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - MooTools-core 1.2.4 or higher
   - MooTools-more 1.2.4.4 RC1 or higher
*/

var Container = new Class({

    container: null,
    displayBoxes: [],
    feeds: [],

    toggleBox: null,

    displayBoxQueue: [],
    queueTimer: null,
    queueDelay: 500,

    /**
     * Creates a new Container class.
     *
     * Creates a new Container class. This instance will layout its DisplayBoxes
     * in the supplied container element. The container will listen to the
     * search box, emptying itself out when a seach is made
     *
     * @param container {Mixed} The element to layout the DisplayBoxes in
     * @param searchBox {SearchBox} The SearchBox that will create searches for
     *         the feeds in this container.
     */
    initialize: function(container, searchBox){
        this.container = $(container);
        this.masonry = this.container.masonry({ columnWidth: 100, itemSelector: '.displayBox' });

        this.addDisplayBoxFromQueue = this.addDisplayBoxFromQueue.bind(this);

        this.searchBox = searchBox;
        this.searchBox.addEvent('search', (function(event) {
            this.displayBoxQueue = [];
            // Clone the array, as we are removing elements as we go from it
            // Looping over an array as you remove elements from it leads to problems
            $A(this.displayBoxes).each(function(displayBox) {
                this.removeDisplayBox(displayBox);
            }, this);
            $clear(this.queueTimer);

            this.loadedFeeds = 0;
            console.log("BEGIN "+this.loadedFeeds)
            this.numberOfFeeds = this.feeds.length;
        }).bind(this));
    },

    /**
     * Adds a feed to this container
     *
     * @param feed {Feed} The feed to add
     */
    addFeed: function(feed) {
        this.feeds.push(feed);
        feed.addEvent('feedReady', (function(amount) {
            this.loadedFeeds++;
            //increment loading bar
            console.log(this.loadedFeeds)
            if (this.loadedFeeds == this.numberOfFeeds) {
                //hide loading bar
                console.log("END "+this.loadedFeeds)
            }
        }).bind(this));
    },

    /**
     * Adds a DisplayBox to this Container.
     *
     * Adds a DisplayBox to the Containers queue of DisplayBoxes. DisplayBoxes
     * will be added in the future at a time decided by the Container. This is
     * done by calling {@link #queueAddDisplayBox}
     *
     * @param displayBox {DisplayBox} The DisplayBox to add
     */
    addDisplayBox: function(displayBox) {
        this.displayBoxQueue.push(displayBox);
        this.queueAddDisplayBox();
    },

    /**
     * Adds a DisplayBox to this Container from the queue.
     *
     * Adds a DisplayBox from the Containers queue of DisplayBoxes. This method
     * will then call {@link #queueAddDisplayBox}, to add any more queued
     * DisplayBoxes
     *
     * @private
     * @param displayBox {DisplayBox} The DisplayBox to add
     */
    addDisplayBoxFromQueue: function() {
        var displayBox = this.displayBoxQueue.removeRandom();
        var preview = displayBox.getPreview();

        preview.fade('hide');
        preview.fade('in');
        this.container.grab(preview);
        this.container.masonry({appendContent: [preview]});

        displayBox.setContainer(this);
        this.displayBoxes.push(displayBox);

        this.queueTimer = null;
        this.queueAddDisplayBox();
    },

    /**
     * Make a periodical function to add a queued DisplayBox.
     *
     * Make a periodical function to add a queued DisplayBox. This function will
     * only run if there are DisplayBoxes to add, and the periodical function is
     * not already running.
     */
    queueAddDisplayBox: function() {
        // Check it is not already queued
        if (!$chk(this.queueTimer)) {
            if (this.displayBoxQueue.length !== 0) {
                this.queueTimer = this.addDisplayBoxFromQueue.delay(this.queueDelay);
            } else {
                this.queueTimer = null;
            }
        }
    },

    /**
     * Get all the DisplayBoxes being managed by this Container
     *
     * @return An array containing the DisplayBoxes in this Container
     */
    getDisplayBoxes: function(feed) {
        return displayBoxes;
    },

    /**
     * Remove a display box from the Container
     *
     * @param displayBox {DisplayBox} The DisplayBox to remove. If the DisplayBox is
     *         not present, this function does nothing.
     */
    removeDisplayBox: function(displayBox) {
        displayBox.setContainer(null);
        this.displayBoxes.erase(displayBox);
        this.displayBoxQueue.erase(displayBox);
        if (this.container.hasChild(displayBox.getPreview())) {
            this.container.removeChild(displayBox.getPreview());
        }
    },

    /**
     * Get the element that this Container is putting its DisplayBoxes in
     *
     * @return The Element the Container manages
     * @type Element
     */
    getElement: function() {
        return this.container;
    }

});

var FeedToggle = new Class({

    data: null,

    container: null,

    /**
     * Create a new FeedToggle class.
     *
     * Create a new FeedToggle class. It will put the controls for its Feeds
     * in the container element supplied
     *
     * @param container {Element} The Element to put the controls in
     */
    initialize: function(container) {
        this.container = $(container);
    },

    /**
     * Add a feed to this FeedToggle
     *
     * @param feed {Feed} The feed to add to the FeedToggle
     */
    addFeed: function(feed) {
        var button = new Element('a', {
            href : '',
            text: feed.name + ' on/off',
            'class': feed.name+' button'
        });

        button.addEvent('click', function(event) {
            var isVisible = !feed.isVisible();
            event.stop();

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
