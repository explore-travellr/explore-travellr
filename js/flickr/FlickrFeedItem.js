/*
Class: flickr.FlickrFeedItem
   Displays Flickr photos retrieved by a <FlickrFeed>

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
   - <flickr.FlickrFeed>
*/

var FlickrFeedItem = new Class({

    Extends: FeedItem,
    Implements: [Options, Events],
    Serializable: 'FlickrFeedItem',
	
    /**
     * Variable: name
     * The name of this <FeedItem> class, used in the GUI
     */
    name: 'FlickrFeedItem',
	
    /**
     * Variable: photo
     * A <JS::Object> that holds all the information about this Flickr photo
     *
     * Values in this object include:
     *   url - The URL of the photo page
     *   picUrlThumbnail - The URL of the thumbnail
     *   picUrlContent - The URL of the image used in the content 
     */
    photo: null,

    /**
     * Variable: options
     * A <JS::Object> containing options for <FlickrFeedItems>
     *
     *   size - The size of the content image
     *   method - The API method to call to search images
     *   apikey - The Flickr API key to use
     */
    options: {
        size: 'm',
        method: 'flickr.photos.getSizes',
        apikey: '49dbf1eebc2e9dd4ae02a97d074d83fc'
    },

    /**
     * Variable: previewLoaded
     * If the <FeedItem> preview is ready for display. <FlickrFeedItems> need to preload
     * the thumbnail, so this is initially false. The previewLoaded event is fired to indicate
     * this is loaded, and this variable toggled to true
     */
    previewLoaded: false,

    /**
     * Variable: contentLoaded
     * If the <FeedItem> content is ready for display. <FlickrFeedItems> need to preload
     * the main image, so this is initially false. The contentLoaded event is fired to indicate
     * this is loaded, and this variable toggled to true
     */
    contentLoaded: false,

    /**
     * Function: initialize
     * Sets the parameter to a instance variable then sets the url, pic
     * thumbnail and pic content
     *
     * Parameters:
     *     feedObject - The object is associative array of keys related to the feedObject passed in
     */
    initialize: function(feedObject, options) {

        this.setOptions(options);

        this.photo = feedObject;
        this.url = 'http://www.flickr.com/photos/'+this.photo.owner+'/'+this.photo.id;
        this.photo.picUrlThumbnail = 'http://farm'+this.photo.farm+'.static.flickr.com/'+this.photo.server+'/'+this.photo.id+'_'+this.photo.secret+'_m.jpg';
        this.photo.picUrlContent = 'http://farm'+this.photo.farm+'.static.flickr.com/'+this.photo.server+'/'+this.photo.id+'_'+this.photo.secret+'.jpg';

        new Asset.images([this.photo.picUrlThumbnail, this.photo.picUrlContent]);

        this.sizes = {
            thumb: {width: null, height: null},
            content: {width: null, height: null}
        };

        new Request.JSONP({
            url: 'http://api.flickr.com/services/rest/',
            data: {
                api_key:  this.options.apikey,
                method:   this.options.method,
                photo_id: this.photo.id,
                format:   'json'
            },
            callbackKey: 'jsoncallback',
            onSuccess: (function(data) {
                
                this.sizes = {
                    thumb: data.sizes.size[2],
                    content: data.sizes.size[3]
                };
            }).bind(this),
            onComplete: (function() {
                this.previewLoaded = true;
                this.fireEvent('previewLoaded');

                this.contentLoaded = true;
                this.fireEvent('contentLoaded');
            }).bind(this)
        }).send();


        this.size = {
            x: 2
        };
    },

    /**
     * Function: makePreview
     * Builds a <MooTools::Element> containing a preview of this <FlickrFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> containing a preview of this <FlickrFeedItem>
     */
    makePreview: function() {
        var img = new Element('img', {
            src: this.photo.picUrlThumbnail,
            width: this.sizes.thumb.width,
            height: this.sizes.thumb.height,
			title: 'Click to view the "' + this.photo.title + '" photo'
        });
        return new Element('div', {
            'class': 'flickr'
        }).adopt([
            img
        ]);
    },

    /**
     * Function: makeContent
     * Builds a <MooTools::Element> with the contents of this <FlickrFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> with the contents of this <FlickrFeedItem>
     */
    makeContent: function() {
        return new Element('div', {'class': 'flickr'}).adopt([
            new Element('h2').grab(new Element('a', {
                text: this.photo.title,
                href: this.url,
				target: '_blank',
				title: 'Click to go to the origin of the "' + this.photo.title + '" photo'
            })),
            new Element('a', {
					href: this.url,
					target: '_blank',
					title: 'Click to go to the origin of the "' + this.photo.title + '" photo'
				}).grab(new Element('img', {
					src: this.photo.picUrlContent,
                    width: this.sizes.content.width,
                    height: this.sizes.content.height
            }))
        ]);
    },
    
    /**
     * Function: clone
     * Returns a clone of this instance
     *
     * Returns:
     * A clone of this instance
     */
    clone: function() {
        return new FlickrFeedItem(this.photo, this.options);
    },

    /**
     * Function: serialize
     * Returns the photo data, ready for serialization
     *
     * Returns:
     *     The photo data
     */
    serialize: function() {
        return this.photo;
    }
});

/*
Class: FlickrFeedItem.unserialize
   Returns the photo data, ready to be unserialized

Extends:
   <FlickrFeedItem>
*/
FlickrFeedItem.unserialize = function(data) {
    return new FlickrFeedItem(data);
};
