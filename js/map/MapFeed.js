/*
Script: GeckoReviewFeed.js
   GeckoReviewFeed - MooTools based World Nomads feed generator

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - MooTools-core 1.2.4 or higher
   - MooTools-more 1.2.4.4 RC1 or higher
   - Request/Request.JSONP
   - Feed Class
   - GeckoReviewFeedItem Class
*/

var MapFeed = new Class({

    Extends: Feed,

    name: 'Map',

    /**
     * 
     *
     * @param searchFilter The search filter to filter results with
     */
    search: function(searchFilter) {
		
		console.log(searchFilter);
		
        this.parent();
		
		var mapFeedItem = new MapFeedItem(searchFilter);
		
		this.feedItems.push(mapFeedItem);
		
		this.feedReady();
    },
 });
