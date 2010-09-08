/*
Class: twitter.TwitterFeed
   MooTools based Twitter feed generator

Extends:
   <Feed>

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - <MooTools::core> 1.2.4 or higher
   - <MooTools::more> 1.2.4.4 RC1 or higher
   - <Feed>
   - <twitter.TwitterFeedItem>
*/

var TwitterFeed = new Class({

    Extends: Feed,

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
     * Variable: name
     * The name of this <Feed>, used in the GUI
     */
    name: 'Twitter',

    /**
     * Variable: maxId
     * The maximum ID of the tweets to return. Used in paging
     */
    maxId: null,

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
        this.page = 1;
        this.maxId = null;

        // Work out the distance between two points on the globe
        // From http://www.movable-type.co.uk/scripts/latlong.html
        if (searchFilter.location) {
            var loc = searchFilter.location;

            // Radius of the earth, in km
            var R = 6371;
            var lat1 = loc.bounds_l;

            // Points to measure
            var lat1 = loc.bounds_l;
            var lat2 = loc.bounds_r;
            var lon1 = loc.bounds_b;
            var lon2 = loc.bounds_t;

            var toRad = function(num) {
                return num * Math.PI / 180;
            }

            // ???
            var dLat = (lat2-lat1).toRad();
            var dLon = (lon2-lon1).toRad(); 
            var sDLat2 = Math.sin(dLat / 2)
            var sDLon2 = Math.sin(dLon / 2)
            var a = sDLat2 * sDLat2 + Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * sDLon2 * sDLon2;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            var distance = R * c;

            // Profit!
            this.geoCode = loc.lat + "," + loc.lng +"," + distance + "km";
            $$('.Twitterfeed_toggle').removeClass('unavailable');
        } else {
			$$('.Twitterfeed_toggle').addClass('unavailable');
            this.geoCode = null;
        }
    },

    /**
     * Function: getMoreFeedItems
     * Search the feed for items relating to the search terms.
     */
    getMoreFeedItems: function() {
        var tags = [];
        this.searchFilter.nounPhrases.each(function(nounPhrase) {
            tags.push('#' + nounPhrase.content);
        });
        if (tags.length == 0) {
            tags.push('#travel');
            if(this.searchFilter.location) tags.push(this.searchFilter.location.name);
        }
        tags = tags.join(' ');

        // TODO: Check whether the search query contains an activity
        // or location and search accordingly
        new Request.JSONP({
            url: 'http://search.twitter.com/search.json',
            data: {
                geo_code: this.geoCode,
                q: tags,
                lang: 'en',
                page: this.page,
                rpp: this.perPage,
                result_type: 'recent',
                max_id: this.maxId
            },

            onSuccess: this.makeFeedItems.bind(this),
            onError: (function() {
                this.moreFeedItems = false;
                this.feedItemsReady();
            }).bind(this)
        }).send();
        this.page = this.page + 1;
    },

    /**
     * Function: makeFeedItems
     * Makes the individual twitter feed items by sending the each tweet
     * object of the response object to the TwitterFeedItem class and then
     * pushing each of them onto a feedItems array
     *
     * Parameters:
     *     response - object returned by the twitter call
     */
    makeFeedItems: function(response) {
        this.response = response || false;

        if(this.response) {
            this.maxId = this.response.max_id;
            (this.response.results || []).each(function(data) {
                var feedItem = new TwitterFeedItem(data);
                this.feedItems.push(feedItem);
            }, this);
        }
        this.moreFeedItems = this.response && this.response.results.length >= this.perPage;

        this.feedItemsReady();
    }
});


Number.implement({
      toRad: function() {
          return this * Math.PI / 180;
      },
      toDeg: function() {
          return this * 180 / Math.PI;
      }
});
