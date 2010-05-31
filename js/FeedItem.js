/*
Script: FeedItem.js
   FeedItem - MooTools based generic feed item handler

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - MooTools-core 1.2.4 or higher
   - MooTools-more 1.2.4.4 RC1 or higher
   - Utilities/Assets
   - FlickrFeedItem Class
   - TravellrFeedItem Class
   - TwitterFeedItem Class
   - WorldNomadsFeedItem Class
*/

var FeedItem = new Class({

    Implements: [Options, Events],
    
    type: null,
    content: null,
    preview: null,
    size: null,

    initialize: function() { },

    /**
     * Get the content of the FeedItem.
     *
     * Get the content of the FeedItem. The content returned is cached. Only
     * one copy of the content is ever returned. Subsequent calls to this method
     * will return the same Element
     *
     * @return The content
     * @type Element
     */
    getContent: function() {
        if (!this.content) {
            this.content = this.makeContent();
        }
        return this.content;
    },

    /**
     * Get the preview of the FeedItem.
     *
     * Get the preview of the FeedItem. The preview returned is cached. Only
     * one copy of the preview is ever returned. Subsequent calls to this method
     * will return the same Element
     *
     * @return The preview
     * @type Element
     */
    getPreview:function() {
        if (!this.preview) {
            this.preview = this.makePreview();
        }
        return this.preview;
    },

    /**
     * Get the size of the preview
     *
     * @return An object containing an x and y paramater of the size
     * @type Object
     */
    getSize: function() {
        return this.size;
    },
    
    /**
     * Sets the DisplayBox that manages this FeedItem
     *
     * @param displayBox {DisplayBox} The DisplayBox that will manage this FeedItem
     */
    setDisplayBox: function(displayBox) {
        this.displayBox = displayBox;
    },

    /**
     * Returns the DisplayBox that manages this FeedItem
     *
     * @return The DisplayBox that will manage this FeedItem
     * @type DisplayBox
     */
    getDisplayBox: function() {
        return this.displayBox;
    }
});
