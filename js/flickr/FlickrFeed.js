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

    initialize: function() {},

    // fetch JSON from flickr
    search: function(searchFilter) {

        var tags = [];
        searchFilter.tags.each(function(tag) {
            tags.push(tag.tag);
        });
        tags = tags.join(',');

        this.req = new Request.JSONP({
            url: 'http://api.flickr.com/services/rest/',
            data: {
                api_key: 	this.options.apikey,
                method: 	this.options.method,
                per_page: 	this.options.amount,
                tags:           tags,
                woe_id:         searchFilter.location.woe_id,
                format: 	'json'
            },
            callbackKey: 	'jsoncallback',
            onSuccess: 	this.attachPhoto.bind(this)
        }).send();
            
    },

//    // preload all photos
//    preload: function(photoUrl, details) {
//        new Asset.image(photoUrl, {
//            onload: function(photo) {
//                this.injectPhoto(photo, details);
//                this.fireEvent('progress', photo);
//            }.bind(this)
//        });
//    },
//
//    // inject and display photos
//    injectPhoto: function(photo, details) {
//        this.loadCount++;
//
//        if(this.options.toImage) this.ref = 'http://farm'+details.farm+'.static.flickr.com/'+details.server+'/'+details.id+'_'+details.secret+'.jpg';
//        else this.ref = 'http://www.flickr.com/photos/'+details.owner+'/'+details.id;
//
//        this.set[this.loadCount] = new Element('a', {
//            'href': this.ref,
//            'title': details.title,
//            'styles': {
//                'opacity': 0
//            }
//        }).grab(photo).inject(this.where).fade('in');
//
//        if(this.loadCount == this.response.perpage) this.fireEvent('complete', this.set);
//    },

    // convert data into URLs
    attachPhoto: function(response) {
        
        this.response = response.photos;
        response.photos.photo.each(function(photo) {
            var feedItem = new FlickrFeedItem(photo);
            this.feedItems.push(feedItem);
        }, this);

        this.feedReady();
        
    },

    //tesing function for document display
    feedReady: function() {
        this.feedItems.each(function(feedItem) {
            $(document.body).grab(feedItem.getContent());
        });
    }
});