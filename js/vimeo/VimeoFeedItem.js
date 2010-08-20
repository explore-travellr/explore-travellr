/*
Class: flickr.FlickrFeedItem
   Displays Flickr videos retrieved by a <FlickrFeed>

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
   - <flickr.FlickrFeed>
*/

var VimeoFeedItem = new Class({

    Extends: FeedItem,
    Implements: [Options, Events],
    Serializable: 'VimeoFeedItem',

    /**
     * Variable: video
     * A <JS::Object> that holds all the information about this vimeo video
     *
     * Values in this object include:
     *   url - The URL of the video page
     *   picUrlThumbnail - The URL of the thumbnail
     *   picUrlContent - The URL of the image used in the content 
     */
    video: null,

    /**
     * Variable: name
     * The name of this <FeedItem> class, used in the GUI
     */
    name: 'VimeoFeedItem',

    /**
     * Function: initialize
     * Sets the parameter to a instance variable then sets the url, pic
     * thumbnail and pic content
     *
     * Paramaters:
     *     feedObject - The object is associative array of keys related to the feedObject passed in
     */
    initialize: function(feedObject, options) {

        this.setOptions(options);

        this.video = feedObject;
        this.video.url = 'http://www.vimeo.com/'+this.video.id;
        this.video.getThumbnailUrls(video_id);
		
        this.size = {
            x: 2
        };
    },

    /**
     * Function: makePreview
     * Builds a <MooTools::Element> containing a preview of this <FlickrFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> containing a preview of this <FlickrFeedItem>
     */
    makePreview: function() {
        var img = new Element('img', {
            src: this.video.getThumbnailUrls
        });
        return new Element('div', {
            'class': 'vimeo'
        }).adopt([
            img,
        ]);
    },

    /**
     * Function: makeContent
     * Builds a <MooTools::Element> with the contents of this <FlickrFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> with the contents of this <FlickrFeedItem>
     */
    makeContent: function() {
        return new Element('div', {'class': 'vimeo'}).adopt([
            new Element('h2').grab(new Element('a', {
                text: this.video.title,
                href: this.video.url
            })),
            new Element('a', {href: this.video.url}).grab(new Element('img', {
                src: this.video.url
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

VimeoFeedItem.unserialize = function(data) {
    return new VimeoFeedItem(data);
};
