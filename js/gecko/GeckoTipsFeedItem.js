/*
Class: gecko.GeckoTipsFeedItem
   Displays GeckoGo tip retrieved by a <GeckoFeed>

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

var GeckoTipsFeedItem = new Class({

    Extends: FeedItem,
    Serializable: 'GeckoTipsFeedItem',
	
    /**
     * Variable: name
     * The name of this <FeedItem>, used in the GUI
     */
    name: 'GeckoTipsFeedItem',
	
    /**
     * Variable: post
     * A <JS::Object> holding all the post data
     */
    post: null,

    /**
     * Consructor: initialize
     * Sets a new <GeckoTipsFeedItem> with the content drawn from user Tips
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
     * Builds a <MooTools::Element> containing a preview of this <GeckoTipsFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> containing a preview of this <GeckoTipsFeedItem>
     */
    makePreview: function() {		
        return new Element('div', {
            'class': 'geckoTips'
        }).adopt([
            new Element('p', {
                text: this.post.text.truncateText(100)
            })
        ]);
    },

    /**
     * Function: makeContent
     * Builds a <MooTools::Element> with the content of this <GeckoTipsFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> with the content of this <GeckoTipsFeedItem>
     */
    makeContent: function() {
        return new Element('div', {
            'class': 'GeckoTips'
        }).adopt([
            new Element('h2').grab(new Element('a', {
                href: this.post.url,
                text: 'Gecko travel tip posted on:'+this.post.date,
				target: '_blank',
				title: 'Click to go to the origin of the travel tip'
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
     * A clone of this GeckoTipsFeedItem
     */
    clone: function() {
        return new GeckoTipsFeedItem(this.post);
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
Class: GeckoTipsFeedItem.unserialize
   Returns the gecko tips, ready to be unserialized

Extends:
   <GeckoTipsFeedItem>
*/
GeckoTipsFeedItem.unserialize = function(data) {
    return new GeckoTipsFeedItem(data);
};