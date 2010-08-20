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
    initialize: function(feedObject, options) {

        this.setOptions(options);

        this.video = feedObject;
        this.video.data.items.player = 
    },

    /**
     * Function: makePreview
     * Builds a <MooTools::Element> containing a preview of this <YoutubeFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> containing a preview of this <YoutubeFeedItem>
     */
    makePreview: function() {
        var img = new Element('img', {
            src: this.video.picUrlThumbnail
        });
        return new Element('div', {
            'class': 'Youtube'
        }).adopt([
            img,
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
        return new Element('div', {'class': 'Youtube'}).adopt([
            new Element('h2').grab(new Element('a', {
                text: this.video.title,
                href: this.video.url
            })),
            new Element('a', {href: this.video.url}).grab(new Element('img', {
                src: this.video.picUrlContent
            }))
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
