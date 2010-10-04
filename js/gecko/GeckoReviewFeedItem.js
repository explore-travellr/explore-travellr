/*
Class: gecko.GeckoReviewFeedItem
   Displays GeckoGo review retrieved by a <GeckoFeed>

Extends:
   <FeedItem>

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - <MooTools::core> 1.2.4 or higher
   - <MooTools::more> 1.2.4.4 RC1 or higher
   - <GeckoFeed>
*/

var GeckoReviewFeedItem = new Class({

    Extends: FeedItem,
    Serializable: 'GeckoReviewFeedItem',
	
    /**
     * Variable: name
     * The name of this <FeedItem>, used in the GUI
     */
    name: 'GeckoReviewFeedItem',
	
    /**
     * Variable: post
     * A <JS::Object> holding all the post data
     */
    post: null,

    /**
     * Consructor: initialize
     * Sets a new <GeckoReviewFeedItem> with the content drawn from user Reviews
     *
     * Parameters:
     *      feedObject - The object is associative array of keys related to the feedObject passed in
     */
    initialize: function(feedObject) {
        this.post = feedObject;
        this.size = {
            x: 2
        };
    },

    /**
     * Function: makePreview
     * Builds a <MooTools::Element> containing a preview of this <GeckoReviewFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> containing a preview of this <GeckoReviewFeedItem>
     */
    makePreview: function() {
        return new Element('div', {
            'class': 'geckoReview',
			title: 'Click to read to review'
        }).adopt([
            new Element('p', {
                text: this.post.name+' in '+this.post.country
            })
        ]);
    },

    /**
     * Function: makeContent
     * Builds a <MooTools::Element> with the content of this <GeckoReviewFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> with the content of this <GeckoReviewFeedItem>
     */
    makeContent: function() {
        this.url = this.post.url;
        return new Element('div', {
            'class': 'GeckoReview'
        }).adopt([
            new Element('h2').grab(new Element('a', {
                href: this.post.url,
                text: this.post.name,
				target: '_blank',
				title: 'Click to go to the origin of the "' + this.post.name + '" review'
            })),
            new Element('div', {
                html: this.post.text
            })
        ]);
    },

    /**
     * Function: clone
     * Returns a clone of this instance
     *
     * Returns:
     * A clone of this GeckoReviewFeedItem
     */
    clone: function() {
        return new GeckoReviewFeedItem(this.post);
    },
    
    /**
     * Function: serialize
     * Returns the post data, ready for serialization
     *
     * Returns:
     *     The post data
     */
    serialize: function() {
        return this.post;
    }
});

/*
Class: GeckoReviewFeedItem.unserialize
   Returns the gecko reviews, ready to be unserialized

Extends:
   <GeckoReviewFeedItem>
*/
GeckoReviewFeedItem.unserialize = function(data) {
    return new GeckoReviewFeedItem(data);
};
