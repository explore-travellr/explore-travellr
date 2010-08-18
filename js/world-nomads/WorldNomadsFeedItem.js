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
     * Constructor: initialize
     * Constructs a new <WorldNomadsFeedItem> with the content drawn from the blog post sent in
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
     * Builds a <MooTools::Element> containing a preview of this <WorldNomadsFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> containing a preview of this <WorldNomadsFeedItem>
     */
    makePreview: function() {
        return new Element('div', {
            'class': 'worldNomads'
        }).adopt([
            new Element('img', {
                'src': this.post['adventures:image'].medium
            }),
            new Element('p', {
                text: this.post.title
            })
        ]);
    },

    /**
     * Function: makeContent
     * Builds a <MooTools::Element> with the content of this <WorldNomadsFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> with the content of this <WorldNomadsFeedItem>
     */
    makeContent: function() {
        return new Element('div', {
            'class': 'worldNomads'
        }).adopt([
            new Element('h2').grab(new Element('a', {
                href: this.post.link,
                text: this.post.title
            })),
            new Element('div', {
                html: this.post.description
            })
        ]);
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
