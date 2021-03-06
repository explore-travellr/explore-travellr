/*
Class: travellers-point.TravellersPointFeedItem.js
   Displays Traveller's point post retrieved by a <TravellersPointFeed>

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
   - <TravellersPointFeed>
*/

var TravellersPointFeedItem = new Class({

    Extends: FeedItem,
    Implements: [Options, Events],
    Serializable: 'TravellersPointFeedItem',

    /**
     * Variable: name
     * The name of this <FeedItem>, used in the GUI
     */
    name: 'TravellersPointFeedItem',
	
    /**
     * Variable: post
     * A <JS::Object> holding all the post data
     */
    post: null,

    /**
     * Variable: previewLoaded
     * If the <FeedItem> preview is ready for display. <TravellersPointFeedItem> need to preload
     * the thumbnail, so this is initially false. The previewLoaded function is fired to indicate
     * this is loaded, and this variable toggled to true
     */
    previewLoaded: false,

    /**
     * Consructor: initialize
     * Sets a new <TravellersPointFeedItem> with the content drawn from the blog post sent in
     *
     * Parameters:
     *      feedObject - The object is associative array of keys related to the feedObject passed in
     */
    initialize: function(feedObject, options) {    
		this.setOptions(options);
        this.post = feedObject;
		
		this.size = {
            x: 2
        };
        new Asset.images([this.post['media:thumbnail'].url], {
            onComplete: (function() {
                this.previewLoaded = true;
				this.fireEvent('previewLoaded');
            }).bind(this)
        });

        new Asset.images([this.post['media:content'].url], {
            onComplete: (function() {
                this.contentLoaded = true;
                this.fireEvent.bind(this, 'contentLoaded');
            }).bind(this)
        });
    },

    /**
     * Function: makePreview
     * Builds a <MooTools::Element> containing a preview of this <TravellersPointFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> containing a preview of this <TravellersPointFeedItem>
     */
    makePreview: function() {
        return new Element('div', {
            'class': 'TravellersPoint'
        }).adopt([
            new Element('img', {
                'src': this.post['media:thumbnail'].url,
				title: 'Click to view a larger image of "' + this.post.title + '"'
            }),
            new Element('p', {
                text: this.post.title              
            })
        ]);
    },

    /**
     * Function: makeContent
     * Builds a <MooTools::Element> with the content of this <TravellersPointFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> with the content of this <TravellersPointFeedItem>
     */
    makeContent: function() {
        this.url = this.post.link;
        return new Element('div', {
            'class': 'TravellersPoint'
        }).adopt([
            new Element('h2').grab(new Element('a', {
                href: this.post.link,
                text: this.post.title,
				target: '_blank',
				title: 'Click to go to the source of "' + this.post.title + '"'
            })),
            new Element('div').grab(new Element('img',{'src':this.post['media:content'].url}))
        ]);
    },

    /**
     * Function: clone
     * Returns a clone of this instance
     *
     * Returns:
     * A clone of this TravellersPointFeedItem
     */
    clone: function() {
        return new TravellersPointFeedItem(this.post, this.options);
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
Class: TravellersPointFeedItem.unserialize
   Returns the travellers-point photo, ready to be unserialized

Extends:
   <TravellersPointFeedItem>
*/
TravellersPointFeedItem.unserialize = function(data) {
    return new TravellersPointFeedItem(data);
};
