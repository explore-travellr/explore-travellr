/*
Script: TravellrFeed.js
   TravellrFeed - MooTools based Travellr feed generator

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - MooTools-core 1.2.4 or higher
   - MooTools-more 1.2.4.4 RC1 or higher
   - Request/Request.JSONP
   - Feed Class
   - TravellrFeedItem Class
*/

var TravellrFeed = new Class({
    
    Extends: Feed,

    itemsCalled: null,

    name: 'Travellr',

    /**
     * Search the feed for items relating to the search terms.
     *
     * @param searchFilter The search filter to filter results with
     */
    search: function(searchFilter) {     

        this.parent();

        this.itemsCalled = $random(4,8);
        //this.feedItems = []; Removed : Jake Kobes : 17-May-2010 : this was the problem with travellr feeditems not refreshing
        // TODO: Search for tags individually if nothing is found when searching for them all

        //This line adds the "Didn't find the information..." feedItem
        this.feedItems.push(new TravellrFeedItem.Ask(searchFilter.location_id || null));

        if (!($chk(searchFilter.location) || searchFilter.tags.length !== 0)) {
            this.feedReady();
            return;
        }

        var tags = "";
        searchFilter.tags.each(function(tag) {
            tags = tags + tag.stemmed + " ";
        });

        new Request.JSONP({
            url: 'http://api.travellr.com/explore_travellr/questions',
            data: {
                location_id: (searchFilter.location ? searchFilter.location.id : null),
                tags: tags,
                page: 1,
                per_page: this.itemsCalled,
                include: 'answers'
            },
            onSuccess: this.makeFeedItems.bind(this)
        }).send();
    },

    /**
     * Makes the individual travellr feed items by sending the each question
     * object of the response object to the TravellrFeedItem class and then
     * pushing each of them onto a feedItems array
     *
     * @param response object returned by the travellr call
     */
    makeFeedItems: function(response) {

        this.response = response;

        response.each(function(questionData) {
            var feedItem = new TravellrFeedItem(questionData);
            this.feedItems.push(feedItem);
        }, this);

        this.feedReady();
    }
});
