/*
Class: travellr.TravellrFeed
   TravellrFeed - MooTools based Travellr feed generator

Extends:
   <Feed>

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - <MooTools::core> 1.2.4 or higher
   - <MooTools::more> 1.2.4.4 RC1 or higher
   - <MooTools::more> Request.JSONP
   - <travellr.TravellrFeedItem>
*/

var TravellrFeed = new Class({
    
    Extends: Feed,

    /**
     * Variable: perPage
     * The maximum number of photos displayed
     */
    perPage: 10,

    /**
     * Variable: page
     * The page number of the current search. Incremented every search
     */
    page: 1,

    /**
     * Variable: name
     * The name of this <Feed>, used in the GUI
     */
    name: 'Travellr',

    /**
     * Function: newSearch
     * Reset the feed for a new search
     *
     * Parameters:
     *     searchFilter - The search filter to filter results with
     *
     * See Also:
     *     <Feed::search>
     */
    newSearch: function(searchFilter) {     
        this.parent();
        this.searchFilter = searchFilter;
        this.page = 1;
    },

    /**
     * Function: getMoreFeedItems
     * Get the next page of FeedItems
     */
    getMoreFeedItems: function() {
        // If there is nothing to search for...
        if (!(this.searchFilter.location || this.searchFilter.tags.length !== 0)) {
            this.moreFeedItems = false;
            this.feedItemsReady();
            return;
        }

        // Concatenate all the tag stems
        var tags = this.searchFilter.tags.map(function(tag) {
            return tag.stemmed;
        }).join(' ');

        // Make the request
        new Request.JSONP({
            url: 'http://api.travellr.com/explore_travellr/questions',
            data: {
                location_id: (this.searchFilter.location ? this.searchFilter.location.id : null),
                tags: tags,
                page: this.page,
                per_page: this.perPage,
                include: 'answers'
            },
            onSuccess: this.makeFeedItems.bind(this),
            onFailure: (function() {
                this.moreFeedItems = false;
                this.addAskBox();
                this.feedItemsReady();
            }).bind(this)
        }).send();
        this.page = this.page + 1;
    },

    /**
     * Function: makeFeedItems
     * Makes the individual travellr feed items by sending the each question
     * object of the response object to the TravellrFeedItem class and then
     * pushing each of them onto a feedItems array
     *
     * Parameters:
     *     response - object returned by the travellr call
     */
    makeFeedItems: function(response) {

        this.response = response;

        response.each(function(questionData) {
            var feedItem = new TravellrFeedItem(questionData);
            this.feedItems.push(feedItem);
        }, this);

        this.addAskBox();

        this.moreFeedItems = (response.length >= this.perPage);
        this.feedItemsReady();
    },

    addAskBox: function() {
        if (!this.ask) {
            //This line adds the "Didn't find the information..." feedItem
            this.feedItems.push(new TravellrFeedItem.Ask(this.searchFilter.location_id || null));
            this.ask = true;
        }
    }
});
