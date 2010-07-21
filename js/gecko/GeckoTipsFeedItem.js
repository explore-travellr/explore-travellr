/*
Script: GeckoTipsFeedItem.js
   GeckoTipsFeedItem - MooTools based GeckoGo feed item handler

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - MooTools-core 1.2.4 or higher
   - MooTools-more 1.2.4.4 RC1 or higher
   - FeedItem Class
   - GeckoTipsFeed Class
*/

var GeckoTipsFeedItem = new Class({

    Extends: FeedItem,

    post: null,

    name: 'GeckoTipsFeedItem',

    /**
     * Constructs a new GeckoTipsFeedItem with the content drawn from user Tipss
     *
     * @param post The Tips to draw content from
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
     *              <div class="geckoTips inner">
     *                  <img src=""></img>
     *                  <p></p>
     *              </div>
     *          </div>
     */
    makePreview: function() {
        
		var text = this.post.text;
		text = text.truncateText(100);
		
		
        return new Element('div', {
            'class': 'geckoTips'
        }).adopt([
            new Element('p', {
                text: 'Gecko travel tip: '+text
            })

        ]);
    },

    /**
     * Builds a feed item content div for insertion into the modal box once
     * clicked
     *
     * @example <div class="modal">
     *              <div class="content">
     *                  <div class="GeckoTips">
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
            'class': 'GeckoTips'
        }).adopt([
            new Element('h2').grab(new Element('a', {
                href: this.post.url,
                text: 'Gecko travel tip posted on:'+this.post.date
            })),
            new Element('div', {
                html: this.post.text
            })
        ]);
    }
});
