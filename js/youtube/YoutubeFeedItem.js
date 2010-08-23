/*
Class: Youtube.YoutubeFeedItem
   Displays Youtube videos retrieved by a <YoutubeFeed>

Extends:
   <FeedItem>

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - <MooTools::core> 1.2.4 or higher
   - <MooTools::more> 1.2.4.4 RC1 or higher
   - <MooTools::more> Utilities/Assets
   - <Youtube.YoutubeFeed>
*/

var YoutubeFeedItem = new Class({

    Extends: FeedItem,
    Implements: [Options, Events],
    Serializable: 'YoutubeFeedItem',

    /**
     * Variable: TODO
     */
    video: null,

    /**
     * Variable: name
     * The name of this <FeedItem> class, used in the GUI
     */
    name: 'YoutubeFeedItem',

    /**
     * Function: initialize
     *
     * Parameters:
     *     feedObject - The object is associative array of keys related to the feedObject passed in
     */
    initialize: function(feedObject) {
        this.video = feedObject;
    },

    /**
     * Function: makePreview
     * Builds a <MooTools::Element> containing a preview of this <YoutubeFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> containing a preview of this <YoutubeFeedItem>
     */
    makePreview: function() {
		return new Element('div', {
            'class': 'youtube'
        }).adopt([
			new Element('h2', {
					text: this.video.title
			})
        ]);
    },

    /**
     * Function: makeContent
     * Builds a <MooTools::Element> with the contents of this <YoutubeFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> with the contents of this <YoutubeFeedItem>
     */
    makeContent: function() {
        return new Element('div', {
            'class': 'youtube'
        }).adopt([
            new Element('h2').grab(new Element('a', {
                text: this.video.title,
                href: this.video.player
            })),
        ]);	
    },

    /**
     * Function: serialize
     * Returns the video data, ready for serialization
     *
     * Returns:
     *     The video data
     */
    serialize: function() {
        return this.video;
    }
});

YoutubeFeedItem.unserialize = function(data) {
    return new YoutubeFeedItem(data);
};
