/*
Script: FlickrFeed.js
   FlickrFeed - MooTools based Flickr feed generator

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - MooTools-core 1.2.4 or higher
   - MooTools-more 1.2.4.4 RC1 or higher
   - Request/Request.JSONP
   - Feed Class
   - FlickrFeedItem Class
*/

var FlickrFeed = new Class({
    
    Extends: Feed,

    itemsCalled: null,

    Implements: [Options, Events],
    options: {
        size: 'm',
        method: 'flickr.photos.search',
        apikey: '49dbf1eebc2e9dd4ae02a97d074d83fc'
    },

    requests: 0,

    name: 'Flickr',

    /**
     * Search the feed for items relating to the search terms. Calls
     * makeFeedItems on success.
     *
     * @param searchFilter The search filter to filter results with
     */
    search: function(searchFilter) {
        this.parent();
        
        var tags = [];

        this.itemsCalled = $random(4,8);

        searchFilter.tags.each(function(tag) {
            tags.push(tag.name);
        });
        tags = tags.join(',');
        
        new Request.JSONP({
            url: 'http://api.flickr.com/services/rest/',
                data: {
                api_key: 	this.options.apikey,
                method: 	this.options.method,
                per_page: 	this.itemsCalled,
                tags:           tags,
                woe_id:         (searchFilter.location ? searchFilter.location.woe_id : null),
                format: 	'json',
                sort:           'relevance'
            },
            callbackKey: 	'jsoncallback',
            onSuccess: 	this.makeFeedItems.bind(this)
        }).send();
    },

    /**
     * Makes the individual flickr feed items by sending the each photo
     * object of the response object to the FlickrFeedItem class and then
     * pushing each of them onto a feedItems array
     *
     * @param response object returned by the flickr call
     */
    makeFeedItems: function(response) {

        this.response = response.photos;

        if($chk(this.response)) {
            response.photos.photo.each(function(data) {
                var feedItem = new FlickrFeedItem(data);
                this.feedItems.push(feedItem);
            }, this);
        }

        this.feedReady();
    }
});
