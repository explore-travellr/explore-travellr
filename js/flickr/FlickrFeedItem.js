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
     * Variable: name
     * The name of this <FeedItem> class, used in the GUI
     */
    name: 'FlickrFeedItem',


    /**
     * Variable: previewLoaded
     * If the <FeedItem> preview is ready for display. <FlickrFeedItems> need to preload
     * the thumbnail, so this is initially false. The previewLoaded function is fired to indicate
     * this is loaded, and this variable toggled to true
     */
    previewLoaded: false,

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
        this.photo.url = 'http://www.flickr.com/photos/'+this.photo.owner+'/'+this.photo.id;
        this.photo.picUrlThumbnail = 'http://farm'+this.photo.farm+'.static.flickr.com/'+this.photo.server+'/'+this.photo.id+'_'+this.photo.secret+'_m.jpg';
        this.photo.picUrlContent = 'http://farm'+this.photo.farm+'.static.flickr.com/'+this.photo.server+'/'+this.photo.id+'_'+this.photo.secret+'.jpg';

        new Asset.images([this.photo.picUrlThumbnail], {
            onComplete: (function() {
                this.previewLoaded = true;
                this.fireEvent('previewLoaded');
            }).bind(this)
        });
        new Asset.images([this.photo.picUrlContent], {onComplete: (function() {
            this.contentLoaded = true;
            this.fireEvent('contentLoaded');
        }).bind(this)});

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
            src: this.photo.picUrlThumbnail
        });
        return new Element('div', {
            'class': 'flickr'
        }).adopt([
            img,
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
                href: this.photo.url,
				target: '_blank'
            })),
            new Element('a', {
					href: this.photo.url,
					target: '_blank'
				}).grab(new Element('img', {
					src: this.photo.picUrlContent
            }))
        ]);
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
FlickrFeedItem.unserialize = function(data) {
    return new FlickrFeedItem(data);
};
