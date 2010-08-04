/*
Class: twitter.TwitterFeedItem
   Searches the Twitter API for tweets relating to the search term.

Extends:
   <FeedItem>

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - <MooTools::core> 1.2.4 or higher
   - <MooTools::more> 1.2.4.4 RC1 or higher
   - <TwitterFeed>
*/

var TwitterFeedItem = new Class({

    Extends: FeedItem,
    Serializable: 'TwitterFeedItem',

    /**
     * Variable: tweet
     * The tweet data
     */
    tweet: null,

    /**
     * Variable: name
     * The name of this <FeedItem> class, used in the GUI
     */
    name: 'TwitterFeedItem',

    /**
     * Constructor: initialize
     * Create a new <TwitterFeedItem> with the tweet data provided
     *
     * Paramaters:
     *     feedObject - The object is associative array of keys related to the feedObject passed in
     */
    initialize: function(feedObject) {
        
        this.tweet = feedObject;
        this.tweet.url = 'http://twitter.com/' + this.tweet.from_user + '/status/' + this.tweet.id;

        this.size = {
            x: 2
        };
    },

    /**
     * Function: makePreview
     * Builds a <MooTools::Element> containing a preview of the tweet data
     *
     * Returns:
     *     A <MooTools::Element> containing a preview of the tweet data
     */
    makePreview: function() {
        return new Element('div', {
            'class': 'twitter'
        }).adopt([
            new Element('p', {
                text: this.tweet.text.truncateText(100) //Calls parent function
            }),
        ]);
    },

    /**
     * Function: makePreview
     * Builds a <MooTools::Element> containing the tweet data
     *
     * Returns:
     *     A <MooTools::Element> containing the tweet data
     */
    makeContent: function() {
        return new Element('div', {
            'class': 'twitter'
        }).adopt([
            new Element('h2').grab(new Element('a', {
                text: this.tweet.from_user,
                href: this.tweet.url
            })),
            new Element('p', {html:this.tweet.text.tweetify()}),
            new Element('p', {
                'class': 'date',
                text: Date.parse(this.tweet.created_at).toString()
            })
            ]);
    },

    serialize: function() {
        return this.tweet;
    }
});
TwitterFeedItem.unserialize = function(data) {
    return new TwitterFeedItem(data);
};
