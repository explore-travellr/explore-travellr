/*
Class: gecko.GeckoReviewFeed
   Grabs reviews from Gecko via Yahoo Pipes

Extends:
   <Feed>

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - <MooTools::core> 1.2.4 or higher
   - <MooTools::more> 1.2.4.4 RC1 or higher
   - <gecko.GeckoReviewFeedItem>
*/

var GeckoReviewFeed = new Class({

    Extends: Feed,

	/**
	 * Variable: name
	 * The name of thie <Feed>, used in the GUI
	 */
    name: 'GeckoReview',


    /**
	 * Function: search
     * Search the feed for items relating to the latitude and longtitude of the search terms. This particular
     * search is actually done to yahoo pipes in which the pipe handles the request
     * and converts a XML feed from Gecko into a JSON object. It then
     * calls makeFeedItems on success.
     *
	 * Paramaters:
     *     searchFilter - The search filter to filter results with
     */
    search: function(searchFilter) {
        this.empty();

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
    },

    /**
	 * Function: makeFeedItems
     * Makes individual <GeckoReviewFeedItems> from the contents of the API call to Gecko
	 *
	 * Paramaters
     *     response - API response from Gecko
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
