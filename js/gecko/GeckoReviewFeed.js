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

var GeckoReviewFeed = new Class({

    Extends: Feed,

    name: 'GeckoReview',


    /**
     * Search the feed for items relating to the latitude and longtitude of the search terms. This particular
     * search is actually done to yahoo pipes in which the pipe handles the request
     * and converts a XML feed from Gecko into a JSON object. It then
     * calls makeFeedItems on success.
     *
     * @param searchFilter The search filter to filter results with
     */
    search: function(searchFilter) {
        this.parent();

        if(searchFilter.location != null){
			var lat = searchFilter.location.lat;
			var lng = searchFilter.location.lng;
		   
		 
			new Request.JSONP({
				url: 'http://pipes.yahoo.com/pipes/pipe.run',
				data: {
					_id: '0f5f327e38d7d95de1d741c1bc41544a',
					_render: 'json',
					lat: lat,
					lng: lng,
					type: 'Listings'
				   
				},
				callbackKey: '_callback',
				onSuccess: this.makeFeedItems.bind(this)
			}).send();
		}
    },

    /**
     * Makes the individual Gecko feed items by sending the each review
     * post object of the response object to the GeckoReviewFeedItem class and then
     * pushing each of them onto a feedItems array
     *
     * @param response object returned by the yahoo pipes call (parsing Gecko feeds)
     */
    makeFeedItems: function(results) {
        if (results && results.value && results.value.items && $chk(results.value.items.length)) {
            results.value.items.each(function(post) {
                this.feedItems.push(new GeckoReviewFeedItem(post));
            }, this);
            this.feedReady();
        }
    }

 });
