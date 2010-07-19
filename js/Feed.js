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
     * Paramaters:
     *     searchBox - The <SearchBox> that this <Feed> is driven by
     *     container - The <Container> that this <Feed> should put its content into
     */
    initialize: function(searchBox, container) {
        this.searchBox = searchBox;
        this.container = container;

        this.bound = this.bindMethods(this.bound);
        this.attach();

        this.container.addFeed(this);
    },

    /**
     * Function: search
     * Search the feed for items relating to the search terms. Calls
     * <feedReady> when all the <FeedItem>s are found.
     * 
     * This is an abstract method.
     *
     * Paramaters:
     *     searchFilter - The <SearchFilter> to filter the feed results with
     */
    search: function() {
        this.feedItems = [];
    },

    /**
     * Function: bindMethods
     * The method binds all of the methods in unbound to this. The
     * bound methods are used for events and such.
     *
     * Paramaters:
     *     unbound - A <JS::Object> of method names to bind
     *
     * Returns:
     *     A hash of the methods, bound to this
     */
    bindMethods: function(unbound) {
        var bound = {};
        $H(unbound).each(function(value, key){
            bound[key] = this[key].bind(this);
        }, this);
        return bound;
    },

    /**
     * Function: attach
     * Attach event listeners. <bindMethods> must be called first.
     *
     * See Also:
     *     <detach>
     */
    attach: function() {
        this.searchBox.addEvent('search', this.bound.search);
    },

    /**
     * Function: detach
     * Detach event listeners.
     *
     * See Also:
     *     <attach>
     */
    detach: function() {
        this.searchBox.removeEvent('search', this.bound.search);
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

     * Paramaters:
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
    feedReady: function() {
        this.getFeedItems().each(function(feedItem) {
            var displayBox = new DisplayBox(feedItem);
            if (this.isVisible()) {
                this.container.addDisplayBox(displayBox);
            }
        }, this);
    }

});
