/*
Script: TwitterFeedItem.js
   TwitterFeedItem - MooTools based Twitter feed item handler

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - MooTools-core 1.2.4 or higher
   - MooTools-more 1.2.4.4 RC1 or higher
   - FeedItem Class
   - TwitterFeed Class
*/

var TwitterFeedItem = new Class({

    Extends: FeedItem,
    Serializable: 'TwitterFeedItem',

    tweet: null,

    name: 'TwitterFeedItem',

    /**
     * Sets the parameter to a instance variable then sets the url, pic
     * thumbnail and pic content
     *
     * @param feedObject The object is associative array of keys related
     * to the feedObject passed in
     */
    initialize: function(feedObject) {
        
        this.tweet = feedObject;
        this.tweet.url = 'http://twitter.com/' + this.tweet.from_user + '/status/' + this.tweet.id;

        this.size = {
            x: 2
        };
    },

    /**
     * Builds a feed item preview to go in the displayBox within the container
     *
     * @example <div class="displayBox">
     *              <div class="twitter inner">
     *                  <p></p>
     *              </div>
     *          </div>
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
     * Builds a feed item content div for insertion into the modal box once
     * clicked
     *
     * @example <div class="modal">
     *              <div class="content">
     *                  <div class="twitter">
     *                      <h2>
     *                          <a href=""></a>
     *                      </h2>
     *                      <p></p>
     *                      <p class="date"></p>
     *                  </div>
     *              </div>
     *         </div>
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
