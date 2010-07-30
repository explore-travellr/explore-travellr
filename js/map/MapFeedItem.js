/*
Script: MapFeedItem.js
   MapFeedItem - MooTools based GeckoGo feed item handler

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - MooTools-core 1.2.4 or higher
   - MooTools-more 1.2.4.4 RC1 or higher
   - FeedItem Class
   - GeckoReviewFeed Class
*/

var MapFeedItem = new Class({

    Extends: FeedItem,

    post: null,
	lat: null,
	lng: null,
	
    name: 'MapFeedItem',

    /**
     * Constructs a new MapFeedItem with the content drawn from user reviews
     *
     * @param post The review to draw content from
     */
    initialize: function(lat, lgn) {
        this.post = post;
		this.lat = lat;
		this.lng = lng;
    },

    /**
     * Builds a feed item preview to go in the displayBox within the container
     *
     * @example <div class="displayBox">
     *              <div class="geckoReview inner">
     *                  <img src=""></img>
     *                  <p></p>
     *              </div>
     *          </div>
     */
    makePreview: function() {
        //console.log(this.post);
        return new Element('div', {
            'id': 'map_canvas'
        })
    },

    /**
     * Builds a feed item content div for insertion into the modal box once
     * clicked
     *
     * @example <div class="modal">
     *              <div class="content">
     *                  <div class="GeckoReview">
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
            'class': 'GeckoReview'
        }).adopt([
            new Element('h2').grab(new Element('a', {
                href: this.post.url,
                text: this.post.name
            })),
            new Element('div', {
                html: this.post.text
            })
        ]);
    }
});
