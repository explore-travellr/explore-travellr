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

    getContent: function() {
        if (!this.content) {
            this.content = this.makeContent();
        }
        return this.content;
    },

    getPreview:function() {
        if (!this.preview) {
            this.preview = this.makePreview();
        }
        return this.preview;
    },

    getSize: function() {
        return this.size;
    },
    
    setDisplayBox: function(displayBox) {
        this.displayBox = displayBox;
    },

    getDisplayBox: function() {
        return this.displayBox;
    },

    // Possiblly irrelivant
    hasPreview: function() {
        return true;
    },

    // Possiblly irrelivant
    hasContent: function() {
        return true;
    }
});
