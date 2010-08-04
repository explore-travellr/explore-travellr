/*
Script: TwitterFeed.js
   TwitterFeed - MooTools based Twitter feed generator

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - MooTools-core 1.2.4 or higher
   - MooTools-more 1.2.4.4 RC1 or higher
   - Request/Request.JSONP
   - Feed Class
   - TwitterFeedItem Class
*/

var TwitterFeed = new Class({
    
    Extends: Feed,

    itemsCalled: null,

    name: 'Twitter',
    
    /**
     * Search the feed for items relating to the search terms.
     *
     * @param searchFilter The search filter to filter results with
     */
    search: function(searchFilter) {
        this.empty();

        this.itemsCalled = $random(4,8);
        // TODO: Search for tags individually if nothing is found when searching for them all

        var tags = "";
        searchFilter.tags.each(function(tag) {
            tags = tags + tag.name + " ";
        });

        // TODO: Check whether the search query contains an activity or location and search accordingly
        new Request.JSONP({
            url: 'http://search.twitter.com/search.json',
            data: {
                geo_code: (searchFilter.location ? searchFilter.location.lat + "," + searchFilter.location.lng +",1mi" : null),
                q: searchFilter.searchString,
                lang: 'en',
                page: 1,
                rpp: this.itemsCalled,
                result_type: 'recent' //results can also be popular or mixed
            },
            onSuccess: this.makeFeedItems.bind(this)
        }).send();
    },

    /**
     * Makes the individual twitter feed items by sending the each tweet
     * object of the response object to the TwitterFeedItem class and then
     * pushing each of them onto a feedItems array
     *
     * @param response object returned by the twitter call
     */
    makeFeedItems: function(response) {

        this.response = response;

        if($chk(this.response)) {
            response.results.each(function(data) {
                var feedItem = new TwitterFeedItem(data);
                this.feedItems.push(feedItem);
            }, this);
        }
        
        this.feedReady();
    }
});
