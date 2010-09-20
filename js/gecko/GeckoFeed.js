/*
Class: gecko.GeckoFeed
    Grabs reviews and tips from Gecko via Yahoo Pipes

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
   - <gecko.GeckoFeedItem>
*/

var GeckoFeed = new Class({

    Extends: Feed,

    /**
    * Variable: name
    * The name of thie <Feed>, used in the GUI
    */
    name: 'GeckoGo',

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

    newSearch: function(searchFilter) {
        this.parent();
        this.searchFilter = searchFilter;
        this.page = 1;
    },
    /**
    * Function: search
    * Search the feed for items relating to the latitude and longtitude of the search terms. This particular
    * search is actually done to yahoo pipes in which the pipe handles the request
    * and converts a XML feed from Gecko into a JSON object. It then
    * calls makeFeedItems on success.
    *
    * Parameters:
    *     searchFilter - The search filter to filter results with
    */
    getMoreFeedItems: function() {
        if (!this.searchFilter.location) {
			$$('.Geckofeed_toggle').addClass('unavailable');
            this.moreFeedItems = false;
            this.feedItemsReady();
            return;
        }
		$$('.Geckofeed_toggle').removeClass('unavailable');
        
        var lat = this.searchFilter.location.lat;
        var lng = this.searchFilter.location.lng;
		
		console.log(lat+" "+lng);
		
        new Request.JSONP({
            url: 'http://pipes.yahoo.com/pipes/pipe.run',
            data: {
                _id: '96347c2974cff0c14401dd3ff630a0a6',
                _render: 'json',
                lat: lat,
                lng: lng,
                type: 'Tips',
                page: this.page,
                per_page: this.perPage
            },
            callbackKey: '_callback',
            onSuccess: this.makeFeedItems.bind(this),
            onFailure: (function() {
                this.moreFeedItems = false;
                this.feedItemsReady();
            }).bind(this)
        }).send();
        this.page = this.page + 1;
    },

    /**
    * Function: makeFeedItems
    * Makes individual <GeckoReviewFeedItems> or <GeckoTipsFeedItems> from the contents of the API call to Gecko
    *
    * Parameters
    *     response - API response from Gecko
    */
    makeFeedItems: function(results) {
        if (results && results.value && results.value.items && $chk(results.value.items.length)) {
            results.value.items.each(function(post) {
                // GeckoGo Review or GeckoGo Tips
                this.feedItems.push(post.id ? new GeckoReviewFeedItem(post) : new GeckoTipsFeedItem(post));
            }, this);
            this.moreFeedItems = results.value.items.length >= this.perPage;
        } else {
            this.moreFeedItems = false;
        }

        this.feedItemsReady();
    }
});
