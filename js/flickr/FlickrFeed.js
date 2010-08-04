/*
Class: flickr.FlickrFeed
Fetches feed data from Flickr photo streams

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
   - <FlickrFeedItem>
*/

var FlickrFeed = new Class({
    
    Implements: [Options, Events],
    Extends: Feed,

    /**
     * Variable: itemsCalled
     * The number of results displayed
     */
    itemsCalled: null,

    /**
     * Variable: options
     * A <JS::Object> containing options for <FlickrFeeds>
     *
     *   size - The size of the content image
     *   method - The API method to call to search images
     *   apikey - The Flickr API key to use
     */
    options: {
        size: 'm',
        method: 'flickr.photos.search',
        apikey: '49dbf1eebc2e9dd4ae02a97d074d83fc'
    },

    // TODO Investigate if this is used
    requests: 0,

    /**
     * Variable: name
     * The name of this <Feed>, for use in the GUI
     */
    name: 'Flickr',

    /**
     * Function: search
     * Search the feed for items relating to the search terms. Calls
     * makeFeedItems on success.
     *
     * Paramaters:
     *
     *     searchFilter - The search filter to filter results with
     */
    search: function(searchFilter) {
        this.empty();
        
        var tags = [];

        this.itemsCalled = $random(4,8);

        searchFilter.tags.each(function(tag) {
            tags.push(tag.name);
        });
        tags = tags.join(',');
        
        new Request.JSONP({
            url: 'http://api.flickr.com/services/rest/',
                data: {
                api_key: this.options.apikey,
                method: this.options.method,
                per_page: this.itemsCalled,
                tags: tags,
                woe_id: (searchFilter.location ? searchFilter.location.woe_id : null),
                format: 'json',
                sort: 'relevance'
            },
            callbackKey: 'jsoncallback',
            onSuccess: this.makeFeedItems.bind(this)
        }).send();
    },

    /**
     * Function: makeFeedItems
     * Makes the individual <FlickrFeedItems> by sending the each photo
     * object of the response object to the <FlickrFeedItem> class and then
     * pushing each of them onto the <Feed::feedItems> array
     *
     * Paramaters:
     *     response - object returned by the flickr call
     */
    makeFeedItems: function(response) {

        this.response = response.photos;

        if($chk(this.response)) {
            response.photos.photo.each(function(data) {
                var feedItem = new FlickrFeedItem(data);
                this.feedItems.push(feedItem);
            }, this);
        }

        this.feedReady();
    }
});
