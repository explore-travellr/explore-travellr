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
     * Variable: itemsCalled
     * The random number of tweets to display
     */
    itemsCalled: null,

    /**
     * Variable: name
     * The name of this <Feed>, used in the GUI
     */
    name: 'Twitter',
    
    /**
     * Function: search
     * Search the feed for items relating to the search terms.
     *
     * Paramaters:
     *     searchFilter - The search filter to filter results with
     */
    search: function(searchFilter) {
        this.empty();

        this.itemsCalled = $random(4,8);
        // TODO: Search for tags individually if nothing is found when searching for them all
        
        var tags = []; // to search for travel also, add 'travel' into the array
        searchFilter.nounPhrases.each(function(nounPhrase) {
            tags.push('#' + nounPhrase.content);//converts all noun phrases into hashtags
        });
        tags = tags.join(' ');

        // TODO: Check whether the search query contains an activity or location and search accordingly
        new Request.JSONP({
            url: 'http://search.twitter.com/search.json',
            data: {
                geo_code: (searchFilter.location ? searchFilter.location.lat + "," + searchFilter.location.lng +",1mi" : null),
                q: tags,
                lang: 'en',
                page: 1,
                rpp: this.itemsCalled,
                result_type: 'recent' //results can also be popular or mixed
            },

            onSuccess: this.makeFeedItems.bind(this)
        }).send();
    },

    /**
     * Function: makeFeedItems
     * Makes the individual twitter feed items by sending the each tweet
     * object of the response object to the TwitterFeedItem class and then
     * pushing each of them onto a feedItems array
     *
     * Paramaters:
     *     response - object returned by the twitter call
     */
    makeFeedItems: function(response) {
        this.response = response;
        if($chk(this.response)) {
            response.results.each(function(data) {
                var feedItem = new TwitterFeedItem(data);
                this.feedItems.push(feedItem);
            }, this);
        }       
        this.feedReady();
    }
});
