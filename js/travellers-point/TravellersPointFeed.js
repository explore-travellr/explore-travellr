/*
Class: travellers-point.TravellersPointFeed
    Gets a stream of google maps by location

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
   - <travellers-point.TravellersPointFeedItem>
*/

var TravellersPointFeed = new Class({

    Extends: Feed,
	
    /**
     * Variable: name
     * The name of thie <Feed>, used in the GUI
     */
    name: 'TravellersPoint',

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
     * Function: newSearch
     * Reset variables and what not ready for a new search
     *
     * Parameters:
     *     searchFilter - The search filter to filter new results with
     */
    newSearch: function(searchFilter) {
        this.parent();
        this.searchFilter = searchFilter;
    },

	/**
     * Function: getMoreFeedItems
     * Gets the feeditems relating to the latitude and longtitude of the search terms. This particular
     * search is actually done to yahoo pipes in which the pipe handles the request
     * and converts a XML feed from Gecko into a JSON object. It then
     * calls makeFeedItems on success.
     */
     getMoreFeedItems: function() {
	 
        var country = (this.searchFilter.location && this.searchFilter.location.country ? this.searchFilter.location.country.toLowerCase() : null);
        if (!country) {
			$$('.TravellersPointfeed_toggle').addClass('unavailable');
            this.moreFeedItems = false;
            this.feedItemsReady();
            return;
        }
		$$('.TravellersPointfeed_toggle').removeClass('unavailable');
		        
        new Request.JSONP({
            url: 'http://pipes.yahoo.com/pipes/pipe.run',
            data: {
                _id: 'e8e8994969edba5692e72656a04cf7e7',
                _render: 'json',
                countries: country
            },
            callbackKey: '_callback',
            onSuccess: this.makeFeedItems.bind(this),
            onFailure: (function() {
                this.moreFeedItems = false;
                this.feedItemsReady();
            }).bind(this)
        }).send();
    },

    /**
	 * Function: makeFeedItems
     * Makes the individual travellers point feed items by sending the each journal
     * post object of the response object to the TravellersPointFeedItem class and then
     * pushing each of them onto a feedItems array
     *
     * Parameters:
	 *     response - object returned by the yahoo pipes call (parsing travellers point feeds)
     */
    makeFeedItems: function(results) {
        if (results && results.value && results.value.items && $chk(results.value.items.length)) {
            results.value.items.each(function(post) {
                this.feedItems.push(new TravellersPointFeedItem(post));
            }, this);
        }

        this.moreFeedItems = false;
        this.feedItemsReady();
    }
 });
