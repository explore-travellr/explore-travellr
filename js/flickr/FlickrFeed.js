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
   - JSONP
*/

var FlickrFeed = new Class({
    Extends: Feed,
    Implements: [Options, Events],
    options: {
        size: 'm',
        method: 'flickr.photos.search',
        amount: 5,
        apikey: '49dbf1eebc2e9dd4ae02a97d074d83fc'
    },

    requests: 0,

    name: 'Flickr',

    // fetch JSON from flickr
    search: function(searchFilter) {
        this.parent();
        var tags = [];

        searchFilter.tags.each(function(tag) {
            tags.push(tag.name);
        });
        tags = tags.join(',');

        this.req = new Request.JSONP({
            url: 'http://api.flickr.com/services/rest/',
                data: {
                api_key: 	this.options.apikey,
                method: 	this.options.method,
                per_page: 	this.options.amount,
                tags:           tags+', travel',
                woe_id:         (searchFilter.location ? searchFilter.location.woe_id : null),
                format: 	'json'
            },
            callbackKey: 	'jsoncallback',
            onSuccess: 	this.makeFeedItems.bind(this)
        }).send();

    },

    makeFeedItems: function(response) {

        this.response = response.photos;
        //console.log(response);
        if($chk(this.response)) {
            response.photos.photo.each(function(photo) {
                var feedItem = new FlickrFeedItem(photo);
                this.feedItems.push(feedItem);
            }, this);
        }

        this.feedReady();

    }
});
