/*
Script: FlickrFeedItem.js
   FlickrFeedItem - MooTools based Flickr feed item handler

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - MooTools-core 1.2.4 or higher
   - MooTools-more 1.2.4.4 RC1 or higher
   - Utilities/Assets
   - FeedItem Class
   - FlickrFeed Class
*/

var FlickrFeedItem = new Class({

    Extends: FeedItem,

    photo: null,

    name: 'FlickrFeedItem',

    /**
     * Sets the parameter to a instance variable then sets the url, pic
     * thumbnail and pic content
     *
     * @param feedObject The object is associative array of keys related
     * to the feedObject passed in
     */
    initialize: function(feedObject) {

        this.photo = feedObject;
        this.photo.url = 'http://www.flickr.com/photos/'+this.photo.owner+'/'+this.photo.id;
        this.photo.picUrlThumbnail = 'http://farm'+this.photo.farm+'.static.flickr.com/'+this.photo.server+'/'+this.photo.id+'_'+this.photo.secret+'_m.jpg';
        this.photo.picUrlContent = 'http://farm'+this.photo.farm+'.static.flickr.com/'+this.photo.server+'/'+this.photo.id+'_'+this.photo.secret+'.jpg';

        new Asset.images([this.photo.picUrlThumbnail, this.photo.picUrlContent]);

        this.size = {
            x: 2
        };
    },

    /**
     * Builds a feed item preview to go in the displayBox within the container
     *
     * @example <div class="flickr displayBox">
     *              <img src=""></img>
     *          </div>
     */
    makePreview: function() {
        var img = new Element('img', {
            src: this.photo.picUrlThumbnail
        });
        return new Element('div', {
            'class': 'flickr'
        }).adopt([
            img,
        ]);
    },

    /**
     * Builds a feed item content div for insertion into the modal box once
     * clicked
     *
     * @example <div class="modal">
     *              <div class="content">
     *                  <div class="flickr">
     *                      <h2></h2>
     *                      <a href=""></a>
     *                  </div>
     *              </div>
     *         </div>
     */
    makeContent: function() {
        return new Element('div', {'class': 'flickr'}).adopt([
            new Element('h2').grab(new Element('a', {
                text: this.photo.title,
                href: this.photo.url
            })),
            new Element('a', {href: this.photo.url}).grab(new Element('img', {
                src: this.photo.picUrlContent
            }))
        ]);
    }
});
