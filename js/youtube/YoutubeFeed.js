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
     * Variable: perPage
     * The number of videos to return per request
     */
    perPage: 10,

    /**
     * Variable: startIndex
     * The start index of the videos to return. Results are 'paginated' using this
     */
    startIndex: null,

    /**
     * Variable: name
     * The name of this <Feed>, for use in the GUI
     */
    name: 'Youtube',

    /**
     * Function: newSearch
     * Search the feed for items relating to the search terms. Calls
     * makeFeedItems on success.
     *
     * Parameters:
     *     searchFilter - The search filter to filter results with
     */
    newSearch: function(searchFilter) {
        this.parent();
        this.searchFilter = searchFilter;
        this.startIndex = 1;

        var tags = [];
        if (searchFilter.location) {
            tags.push(searchFilter.location.name);
        }

        searchFilter.tags.each(function(tag) {
            tags.push(tag.name);
        });
		
        tags = tags.join('+-');

        this.tags = tags;
    },

    /**
     * Function: getMoreFeedItems
     * Fetch more feed items from the feed
     */
    getMoreFeedItems: function() {

        // If query string is empty (x-men bug)
        if (!this.tags) {
                        $$('.YoutubeFeed_toggle').addClass('unavailable');
            this.moreFeedItems = false;
            this.feedItemsReady();
            return;
        }

        new Request.JSONP({
            url: 'http://gdata.youtube.com/feeds/api/videos',
            data: {
                q: 	this.tags,
                key: 'AI39si6I6tBAD_U7oB8R5ESjFBD_9QMqcz5NrRIxFtCTbjEgJDiBLmxZ8EVu8iUTznjUuxRhPy2MWotbPhkrUfyPeOFa3KhLBA',
                v: 2,
                safeSearch: 'moderate',
                alt: "jsonc",
                'start-index': this.startIndex,
                'max-results': this.perPage
            },
            onSuccess: this.makeFeedItems.bind(this)
        }).send();

        this.startIndex = this.startIndex + this.perPage;
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
        this.response = response;

        if(this.response.data.items) {
            response.data.items.each(function(data) {
                var feedItem = new YoutubeFeedItem(data);
                this.feedItems.push(feedItem);
            }, this);
            this.moreFeedItems = this.response.data.items.length >= this.perPage;
        } else {
            this.moreFeedItems = false;
        }

        this.feedItemsReady();
    }
});
