/*
Class: world-nomads.WorldNomadsFeedItem
Displays blog posts from the <WorldNomadsFeed>

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - MooTools-core 1.2.4 or higher
   - MooTools-more 1.2.4.4 RC1 or higher
   - FeedItem Class
   - WorldNomadsFeed Class
*/

var WorldNomadsFeedItem = new Class({

    Extends: FeedItem,
    Serializable: 'WorldNomadsFeedItem',

    post: null,

    name: 'WorldNomadsFeedItem',

    /**
     * Constructor: initialize
     * Constructs a new WorldNomadsFeedItem with the content drawn from the blog post sent in
     *
     * Paramaters:
     *     post - The blog post to draw content from
     */
    initialize: function(post) {
        this.post = post;

        this.size = {
            x: 2
        };
    },

    /**
     * Function: makePreview
     * Builds a <MooTools::Element> containing a preview of the blog post
     *
     * Returns:
     *     A <MooTools::Element> containing a preview of the blog post
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
     * Builds a <MooTools::Element> containing the text of the blog post
     *
     * Returns:
     *     A <MooTools::Element> containing the text of the blog post
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

    serialize: function() {
        return this.post;
    }
});
WorldNomadsFeedItem.unserialize = function(data) {
    return new WorldNomadsFeedItem(data);
};
