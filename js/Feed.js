/*
Class: Feed
   Abstract Feed class. This contains basic functionality that all classes extending <Feed> will need

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - <MooTools::core> 1.2.4 or higher
   - <MooTools::more> 1.2.4.4 RC1 or higher
   - <MooTools::Request.JSONP>
*/
var Feed = new Class({

    Implements: [Events],

    /**
     * Variable: visible
     * If this <Feed> is shown
     */
    visible: true,

    /**
     * Variable: feedItems
     * An <JS::Array> of all the <FeedItem>s belonging to this <Feed>
     */
    feedItems: [],

    itemsCalled: null,

    getNextFeedItemQueue: [],

    moreFeedItems: true,

    /**
     * Variable: bound
     * An <JS::Object> of all the bound methods, for events and such
     */
    bound: {
        search: null
    },

    /**
     * Constructor: initialize
     * Create a new <Feed>
     *
     * Parameters:
     *     searchBox - The <SearchBox> that this <Feed> is driven by
     *     container - The <Container> that this <Feed> should put its content into
     */
    initialize: function(searchBox, container, scrapbook) {
        this.searchBox = searchBox;
        this.container = container;
        this.scrapbook = scrapbook;

        this.container.addFeed(this);
    },

    /**
     * Function: search
     * Search the feed for items relating to the search terms. Calls
     * <feedReady> when all the <FeedItem>s are found.
     * 
     * This is an abstract method.
     *
     * Parameters:
     *     searchFilter - The <SearchFilter> to filter the feed results with
     */
    getMoreFeedItems: function() { },

    /**
     * Function: empty
     * Removes all <FeedItems> from the <Feed> and <Container>.
     */
    newSearch: function() {
        this.feedItems.each(function(feedItem) {
            this.container.removeDisplayBox(feedItem.getDisplayBox());
        }, this);
        this.feedItems = [];

        this.moreFeedItems = true;
        this.nextFeedItem = 0;
    },



    getNextFeedItem: function(callback) {

        if (this.nextFeedItem >= this.feedItems.length) {
            if (this.moreFeedItems) {
                this.getNextFeedItemQueue.push(callback);
                this.getMoreFeedItems();
            } else {
                callback(false);
            }
        } else {
            var next = this.feedItems[this.nextFeedItem];
            this.nextFeedItem = this.nextFeedItem + 1;
            callback(next);
        }

    },

    /**
     * Function: isVisible
     * Check to see if the feed is currently visible
     *
     * Returns:
     *     True if the feed is visible, false otherwise
     *
     * See Also:
     *     <setVisible>
     */
    isVisible: function() {
        return this.visible;
    },

    /**
     * Function: setVisible
     * Parameters:
     *     visible - True if the feed should be visible, false otherwise.
     *
     * See Also:
     *     <isVisible>
     */
    setVisible: function(visible) {
        if (this.visible != visible) {
            this.visible = visible;

            if (this.visible) {
                this.feedItems.each(function(feedItem) {
                    this.container.addDisplayBox(feedItem.getDisplayBox() || new DisplayBox(feedItem));
                }, this);
                this.fireEvent('shown');
            } else {
                this.feedItems.each(function(feedItem) {
                    this.container.removeDisplayBox(feedItem.getDisplayBox());
                }, this);
                this.fireEvent('hidden');
            }
        }
    },

    /**
     * Function: getFeedItems
     * Retrieve all <FeedItem>s currently displayed by this <Feed>.
     *
     * Returns:
     *     The <FeedItem>s the <Feed> is currently displaying.
     */
    getFeedItems: function() {
        return this.feedItems;
    },

    /**
     * Function: feedReady
     * Feeds implementing this abstract class should call this when the
     * <FeedItem>s are ready. This adds the <FeedItem>s to the <Container>,
     * in a new <DisplayBox>.
     */
    feedItemsReady: function() {

        var queue = this.getNextFeedItemQueue;
        this.getNextFeedItemQueue = [];
        queue.each(function (callback) {
            this.getNextFeedItem(callback);
        }, this);

        this.fireEvent('feedItemsReady', this);
    }

});
