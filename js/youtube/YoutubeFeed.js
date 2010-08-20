/*
Class: youtube.YoutubeFeed
    Fetches feed data from Youtube video streams

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
   - <YoutubeFeeditem>
*/

var YoutubeFeed = new Class({
    
    Implements: [Options, Events],
    Extends: Feed,

    /**
     * Variable: itemsCalled
     * The random number of photos displayed
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
        method: 'TODO',
        apikey: 'TODO'
    },

    /**
     * Variable: name
     * The name of this <Feed>, for use in the GUI
     */
    name: 'Youtube',

    /**
     * Function: search
     * Search the feed for items relating to the search terms. Calls
     * makeFeedItems on success.
     *
     * Parameters:
     *     searchFilter - The search filter to filter results with
     */
    search: function(searchFilter) {
        this.empty();
        
        var tags = [];

        searchFilter.tags.each(function(tag) {
            tags.push(tag.name);
        });
		
        tags = tags.join(',');

        new Request.JSONP({
            url: 'http://gdata.youtube.com/feeds/api/videos',
                data: {
                q: 	this.tags,
                key: 'AI39si6I6tBAD_U7oB8R5ESjFBD_9QMqcz5NrRIxFtCTbjEgJDiBLmxZ8EVu8iUTznjUuxRhPy2MWotbPhkrUfyPeOFa3KhLBA',
				category: 'Travel',
				max-results: 5,
				v: 2,
				safeSearch: 'moderate',
				
            },
            callbackKey: 'jsonp',
            onSuccess: this.makeFeedItems.bind(this)
        }).send();
    },

    /**
     * Function: makeFeedItems
     * Makes the individual <YoutubeFeedItems> by sending each video
     * object of the response object to the <YoutubeFeedItem> class and then
     * pushing each of them onto the <Feed::feedItems> array
     *
     * Parameters:
     *     response - object returned by the youtube call
     */
    makeFeedItems: function(response) {
        var outstanding = 1;
        var feedItemReady = (function() {
            outstanding = outstanding - 1;
            if (outstanding === 0) {
                this.feedReady();
            }
        }).bind(this);

        this.response = response.videos;

        if($chk(this.response)) {
            response.videos.each(function(data) {
                outstanding = outstanding + 1;
                var feedItem = new YoutubeFeedItem(data, {onReady: feedItemReady});
                this.feedItems.push(feedItem);
            }, this);
        }

        // By calling it here, it still works when there are no feed items
        feedItemReady();
    }
});
