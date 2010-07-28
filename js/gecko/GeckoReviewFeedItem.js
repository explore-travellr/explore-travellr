/*
Script: GeckoReviewFeedItem.js
   GeckoReviewFeedItem - MooTools based GeckoGo feed item handler

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

var GeckoReviewFeedItem = new Class({

    Extends: FeedItem,

    post: null,

    name: 'GeckoReviewFeedItem',

    /**
     * Constructs a new GeckoReviewFeedItem with the content drawn from user reviews
     *
     * @param post The review to draw content from
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
     *              <div class="geckoReview inner">
     *                  <img src=""></img>
     *                  <p></p>
     *              </div>
     *          </div>
     */
    makePreview: function() {
        //console.log(this.post);
        return new Element('div', {
            'class': 'geckoReview'
        }).adopt([
            new Element('p', {
                text: 'Gecko has a review for '+this.post.name+' in '+this.post.country
            })

        ]);
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
