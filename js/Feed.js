/*
Script: Feed.js
   Feed - MooTools based generic parent feed generator

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - MooTools-core 1.2.4 or higher
   - MooTools-more 1.2.4.4 RC1 or higher
   - Request/Request.JSONP
   - TwitterFeed Class
   - TravellrFeed Class
   - FlickrFeed Class
   - WorldNomadsFeed Class
*/

var Feed = new Class({

    Implements: [Events],

    visible: true,
    feedItems: [],

    bound: {
        search: null
    },

    initialize: function(searchBox, container) {
        this.searchBox = searchBox;
        this.container = container;

        this.bound = this.bindMethods(this.bound);
        this.attach();

        this.container.addFeed(this);
    },

    /**
     * Search the feed for items relating to the search terms. Calls
     * feedReady when the feedItems are found.
     *
     * @param searchFilter The search filter to filter results with
     */
    search: function() {
        this.feedItems.each(function(feedItem) {
            this.container.removeDisplayBox(feedItem.getDisplayBox());
        }, this);
        
        this.feedItems = [];
    },

    /**
     * The method binds all of the methods in unbound. The
     * methods are then used for events or similar
     *
     * @param unbound A hash of method names to bind
     * @return A hash of the methods, bound to this
     */
    bindMethods: function(unbound) {
        var bound = {};
        $H(unbound).each(function(value, key){
            bound[key] = this[key].bind(this);
        }, this);
        return bound;
    },

    /**
     * Attach event listeners. Bind methods in this.bound first!
     */
    attach: function() {
        this.searchBox.addEvent('search', this.bound.search);
    },

    /**
     * Detach event listeners
     */
    detach: function() {
        this.searchBox.removeEvent('search', this.bound.search);
    },

    /**
     * If the feed is currently visible
     *
     * @return True if the feed is visible, false otherwise
     */
    isVisible: function() {
        return this.visible;
    },

    /**
     * Set the visibility of the feed
     *
     * @param visible True if the feed should be visible, false otherwise
     */
    setVisible: function(visible) {
        if (this.visible != visible) {
            this.visible = visible;

            if (this.visible) {
                this.feedItems.each(function(feedItem) {
                    this.container.addDisplayBox(feedItem.getDisplayBox());
                }, this);
            } else {
                this.feedItems.each(function(feedItem) {
                    this.container.removeDisplayBox(feedItem.getDisplayBox());
                }, this);
            }
        }
    },

    /**
     * Returns an array of all feedItems currently displayed
     *
     * @return The feedItems the feed is currently displaying
     */
    getFeedItems: function() {
        return this.feedItems;
    },

    /**
     * Called when the FeedItems are ready. This adds the FeedItems to the
     * Container, in a new DisplayBox.
     */
    feedReady: function() {
        // So that we dont have to bind. Binding is expensive.
        var container = this.container;
        this.getFeedItems().each(function(feedItem) {
            container.addDisplayBox(new DisplayBox(feedItem));
        });
    }

});
