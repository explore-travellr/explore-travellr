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
     * Variable: name
     * The name of this <FeedItem> class, used in the GUI
     */
    name: 'TwitterFeedItem',
	
    /**
     * Variable: tweet
     * A <JS::Object> holding all the post data
     */
    tweet: null,

    /**
     * Constructor: initialize
     * Create a new <TwitterFeedItem> with the tweet data provided
     *
     * Parameters:
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
		return new Element('div',{
			'class':'twitter'
		}).adopt([
			new Element('img',{
				'class':'user_avatar',
				'src': this.tweet.profile_image_url,
				title: 'User: '+this.tweet.from_user
			}),
			new Element('div',{
				'class':'tweetPreview',
				title: 'A tweet from twitter.com, click to view in a larger window'
			}).adopt([
				new Element('p',{
					text: this.tweet.text.truncateText(100) //Calls parent function
				})
			])
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
                this.url = this.tweet.url;
		var postTime = Date.parse(this.tweet.created_at).toString();
			
		function prettyDate(time){
			var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
				diff = (((new Date()).getTime() - date.getTime()) / 1000),
				day_diff = Math.floor(diff / 86400);
					
			if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 ) { return; }
					
			return day_diff === 0 && (
					diff < 60 && "just now" ||
					diff < 120 && "1 minute ago" ||
					diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
					diff < 7200 && "1 hour ago" ||
					diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
				day_diff == 1 && "Yesterday" ||
				day_diff < 7 && day_diff + " days ago" ||
				day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
		}
			
		postTime = prettyDate(postTime);
	
		return new Element('div', {
            'class': 'twitter'
        }).adopt([
		
			new Element('div',{
				'class':'profile_image'
			}).adopt([
				new Element('img',{
					'src': this.tweet.profile_image_url,
					title: 'User: '+this.tweet.from_user
				})
			]),
			new Element('div',{
				'class':'tweet'
			}).adopt([
				new Element('a', {
					'class' : 'user',
					text: this.tweet.from_user,
					href: this.tweet.url,
					target: '_blank',
					title: 'Click to go to the source of the tweet'
				}),
                new Element('p', {
					'class': 'date',
					text: postTime
				}),
				new Element('p', {
					'class':'tweet_content',
					html:this.tweet.text.tweetify()
				})
				
			])
		]);
    },

    /**
     * Function: clone
     * Returns a clone of this instance
     *
     * Returns:
     * A clone of this TwitterFeedItem
     */
    clone: function() {
        return new TwitterFeedItem(this.tweet);
    },

    /**
     * Function: serialize
     * Returns the tweet data, ready for serialization
     *
     * Returns:
     *     The tweet data
     */
    serialize: function() {
        return this.tweet;
    }
});

/*
Class: TwitterFeedItem.unserialize
   Returns the tweet, ready to be unserialized

Extends:
   <TwitterFeedItem>
*/
TwitterFeedItem.unserialize = function(data) {
    return new TwitterFeedItem(data);
};
