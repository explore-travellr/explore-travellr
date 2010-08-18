/*
Class: lonely-planet.LonelyPlanetFeed
    Fetches feed data from Lonely Planet photo streams

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
   - <Feed>
   - <LonelyPlanetFeedItem>
*/

var LonelyPlanetFeed = new Class({
    
    Implements: [Options, Events],
    Extends: Feed,

    /**
     * Variable: itemsCalled
     * The random number of results displayed
     */
    itemsCalled: null,

    /**
     * Variable: options
     * A <JS::Object> containing options for <LonelyPlanetFeeds>
     *
     *   size - The size of the content image
     *   method - The API method to call to search images
     *   apikey - The Flickr API key to use
     */
    options: {
        //size: 'm',
        //method: 'http://api.lonelyplanet.com/api/places?name=lond',
        //apikey: '49dbf1eebc2e9dd4ae02a97d074d83fc'
    },

    // TODO Investigate if this is used
    requests: 0,

    /**
     * Variable: name
     * The name of this <Feed>, for use in the GUI
     */
    name: 'LonelyPlanet',

    /**
     * Function: search
     * Search the feed for items relating to the search terms. Calls
     * makeFeedItems on success.
     *
     * Parameters:
     *
     *     searchFilter - The search filter to filter results with
     */
    search: function(searchFilter) {
        this.empty();
        
//        var tags = [];

//        this.itemsCalled = $random(4,8);

//        searchFilter.tags.each(function(tag) {
//            tags.push(tag.name);
//        });
//        tags = tags.join(',');
        console.log(searchFilter.searchString);
        new Request.JSON({
        url: 'http://www.lonelyplanet.com/destinations-landing-toppicks-json-feed',
              data: {
              oauth_consumer_key: 'uHlEq1ijsbVkB0cwhbaHUg',
//              oauth_token: ''
//                _id: '7edb44091bd3fc76ed4ff8090ea2609d',
//                _render: 'json',
//                country_id: country_id,
//                type: this.TYPE
            },
            callbackKey: '_callback',
              onSuccess: this.makeFeedItems.bind(this),
                onFailure: console.log("FAIL")
               }).send();       
    },

    /**
     * Function: makeFeedItems
     * Makes the individual <LonelyPlanetFeedItems> by sending the each photo
     * object of the response object to the <LonelyPlanetFeedItem> class and then
     * pushing each of them onto the <Feed::feedItems> array
     *
     * Parameters:
     *     response - object returned by the lonely planet call
     */
    makeFeedItems: function(response) {

        console.log("response: " +response);

        this.feedReady();
    }
});
