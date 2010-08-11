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

    name: 'TravellersPoint',

    /**
     * Search the feed for items relating to the search terms. This particular
     * search is actually done to yahoo pipes in which the pipe handles the request
     * and converts a RSS feed from World Nomads into a JSON object. It then
     * calls makeFeedItems on success.
     *
     * @param searchFilter The search filter to filter results with
     */
    search: function(searchFilter) {
        this.empty();

        var country = (searchFilter.location ? searchFilter.location.country.toLowerCase() : null);
     
        new Request.JSONP({
            url: 'http://pipes.yahoo.com/pipes/pipe.run',
            data: {
                _id: '94c1b9ad6592a64f907e6c6b2b520f78',
                _render: 'json',
                countries: country
               
            },
            callbackKey: '_callback',
            onSuccess: this.makeFeedItems.bind(this)
        }).send();
    },

    /**
     * Makes the individual travellers point feed items by sending the each journal
     * post object of the response object to the TravellersPointFeedItem class and then
     * pushing each of them onto a feedItems array
     *
     * @param response object returned by the yahoo pipes call (parsing travellers point feeds)
     */
    makeFeedItems: function(results) {
        if (results && results.value && results.value.items && $chk(results.value.items.length)) {
            results.value.items.each(function(post) {
                this.feedItems.push(new TravellersPointFeedItem(post));
            }, this);
            this.feedReady();
        }
    }
 });
