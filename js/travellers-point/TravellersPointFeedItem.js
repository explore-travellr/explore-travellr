/*
Script: TravellersPointFeedItem.js
   TravellersPointFeedItem - MooTools based travellers point feed item handler

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - MooTools-core 1.2.4 or higher
   - MooTools-more 1.2.4.4 RC1 or higher
   - FeedItem Class
   - TravellersPointFeed Class
*/

var TravellersPointFeedItem = new Class({

    Extends: FeedItem,

    post: null,

    name: 'TravellersPointFeedItem',

    /**
     * Constructs a new TravellerspointFeedItem with the content drawn from the blog post sent in
     *
     * @param post The blog post to draw content from
     */
    initialize: function(post) {
        this.post = post;

        this.size = {
            x: 2
        };
    },

    /**
     * Builds a feed item preview to go in the displayBox within the container
     *
     * @example <div class="displayBox">
     *              <div class="worldNomads inner">
     *                  <img src=""></img>
     *                  <p></p>
     *              </div>
     *          </div>
     */
    makePreview: function() {
        return new Element('div', {
            'class': 'TravellersPoint'
        }).adopt([
            new Element('img', {
                'src': this.post['media:thumbnail'].url
            }),
            new Element('p', {
                text: this.post.title
                
            })
        ]);
    },

    /**
     * Builds a feed item content div for insertion into the modal box once
     * clicked
     *
     * @example <div class="modal">
     *              <div class="content">
     *                  <div class="TravellersPoint">
     *                      <h2>
     *                          <a href=""></a>
     *                      </h2>
     *                      <div></div>
     *                  </div>
     *              </div>
     *         </div>
     */
    makeContent: function() {
        return new Element('div', {
            'class': 'TravellersPoint'
        }).adopt([
            new Element('h2').grab(new Element('a', {
                href: this.post.link,
                text: this.post.title
            })),
            new Element('div', {
                /*html: this.post.description,*/
             
            }).grab(new Element('img',{
            'src':this.post['media:content'].url}))
        ]);
    }
});
