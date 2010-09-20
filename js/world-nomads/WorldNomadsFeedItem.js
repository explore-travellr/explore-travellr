/*
Class: world-nomads.WorldNomadsFeedItem
    Displays blog posts from the <WorldNomadsFeed>

Extends:
   <FeedItem>

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - <MooTools::core> 1.2.4 or higher
   - <MooTools::more> 1.2.4.4 RC1 or higher
   - <WorldNomadsFeed>
*/

var WorldNomadsFeedItem = new Class({

    Extends: FeedItem,
	Implements: [Options, Events],
    Serializable: 'WorldNomadsFeedItem',

    /**
     * Variable: post
     * A <JS::Object> holding all the post data
     */
    post: null,

    /**
     * Variable: name
     * The name of this <FeedItem>, used in the GUI
     */
    name: 'WorldNomadsFeedItem',
	
    /**
     * Variable: previewLoaded
     * If the <FeedItem> preview is ready for display. <WorldNomadsFeedItem> need to preload
     * the thumbnail, so this is initially false. The previewLoaded function is fired to indicate
     * this is loaded, and this variable toggled to true
     */
    previewLoaded: false,
	
	/**
	 * Variable: options
	 * Options for this instance
	 */
	options: {},

    /**
     * Constructor: initialize
     * Constructs a new <WorldNomadsFeedItem> with the content drawn from the blog post sent in
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
        if (this.post['adventures:image']) {
            new Asset.images([this.post['adventures:image'].medium], {
                onComplete: (function() {
                    this.previewLoaded = true;
                    this.fireEvent('previewLoaded');
                }).bind(this)
            });
        } else {
            this.previewLoaded = true;
            this.fireEvent('ready');
        }
    },

    /**
     * Function: makePreview
     * Builds a <MooTools::Element> containing a preview of this <WorldNomadsFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> containing a preview of this <WorldNomadsFeedItem>
     */
    makePreview: function() {
        var wrapper = new Element('div', {
            'class': 'worldNomads'
        });
        if (this.post['adventures:image']) {
            wrapper.grab(new Element('img', {
                'src': this.post['adventures:image'].medium,
				title: 'Click to view the "' + this.post.title + '" post'
            }));
        }
        wrapper.grab( new Element('p', {
            text: this.post.title
        }));
        return wrapper;
    },

    /**
     * Function: makeContent
     * Builds a <MooTools::Element> with the content of this <WorldNomadsFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> with the content of this <WorldNomadsFeedItem>
     */
    makeContent: function() {
        var output = this.post.description;
        output.replace("<br>","</p>");
        return new Element('div', {
            'class': 'worldNomads'
        }).adopt([
            new Element('h2').grab(new Element('a', {
                href: this.post.link,
                text: this.post.title,
				target: '_blank',
				title: 'Click to go to the origin of the "' + this.post.title + '" post'
            })),

            new Element('div', {
                html: "<p class='infoData'>"+output
            })
        ]);
    },

    /**
     * Function: clone
     * Returns a clone of this instance
     *
     * Returns:
     * A clone of this WorldNomadsFeedItem
     */
    clone: function() {
        return new WorldNomadsFeedItem(this.post, this.options);
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

WorldNomadsFeedItem.unserialize = function(data) {
    return new WorldNomadsFeedItem(data);
};
