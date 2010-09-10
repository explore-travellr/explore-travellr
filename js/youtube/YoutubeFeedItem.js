/*
Class: Youtube.YoutubeFeedItem
   Displays Youtube videos retrieved by a <YoutubeFeed>

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
   - <Youtube.YoutubeFeed>
*/

var YoutubeFeedItem = new Class({

    Extends: FeedItem,
    Implements: [Options, Events],
    Serializable: 'YoutubeFeedItem',

    /**
     * Variable: TODO
     */
    video: null,

    /**
     * Variable: name
     * The name of this <FeedItem> class, used in the GUI
     */
    name: 'YoutubeFeedItem',

    /**
     * Variable: previewLoaded
     * If the <FeedItem> preview is ready for display. <FlickrFeedItems> need to preload
     * the thumbnail, so this is initially false. The previewLoaded function is fired to indicate
     * this is loaded, and this variable toggled to true
     */
    previewLoaded: false,

    /**
     * Function: initialize
     *
     * Parameters:
     *     feedObject - The object is associative array of keys related to the feedObject passed in
     */
     initialize: function(feedObject) {
        this.video = feedObject;
		this.size = {x: 2};
		this.url = "http://www.youtube.com/v/" + this.video.id + "?fs=1&hl=en_GB";
		this.thumbnail = feedObject.thumbnail.hqDefault;
		this.title = this.video.title;

        new Asset.images([this.thumbnail], {
            onComplete: (function() {
                this.previewLoaded = true;
                this.fireEvent('previewLoaded');
            }).bind(this)
        });
    },

    /**
     * Function: makePreview
     * Builds a <MooTools::Element> containing a preview of this <YoutubeFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> containing a preview of this <YoutubeFeedItem>
     */
    makePreview: function() {
		
		//var heading = new Element('h2', {
			//text: this.title
		//});
		
		var img = new Element('img', {
            src: this.thumbnail,
            'class':'ty_thumb'
        });
        
    var play = new Element('img', {
            src: 'styles/images/yt_play.png',
            'class':'yt_play'
        });
        
		return new Element('div', {
            'class': 'youtube'
        }).adopt([img, play])
    },

    /**
     * Function: makeContent
     * Builds a <MooTools::Element> with the contents of this <YoutubeFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> with the contents of this <YoutubeFeedItem>
     */
    makeContent: function() {

        var ytembed = new Swiff( this.url, {
			width: 480,
			height: 385,
			params: {
				allowScriptAccess: "always"
			},
			properties: {
				allowFullScreen: 'true'
			}
		});
		
		var wrapper = new Element('div', {
			styles: {
				width: 500,
				height: 400
			}
		});	
		wrapper.grab(ytembed);
	
		return new Element('div', {
            'class': 'youtube'
        }).adopt(wrapper);
       
    },

    /**
	<object width="480" height="385">
		<param name="movie" value="http://www.youtube.com/v/NkfuPTm1zUo?fs=1&amp;hl=en_GB"></param>
		<param name="allowFullScreen" value="true"></param>
		<param name="allowscriptaccess" value="always"></param>
		<embed src="http://www.youtube.com/v/NkfuPTm1zUo?fs=1&amp;hl=en_GB" 
			type="application/x-shockwave-flash" 
			allowscriptaccess="always" 
			allowfullscreen="true" 
			width="480" 
			height="385">
		</embed>
	</object>
     * Function: serialize
     * Returns the video data, ready for serialization
     *
     * Returns:
     *     The video data
     */
    serialize: function() {
        return this.video;
    }
});

YoutubeFeedItem.unserialize = function(data) {
    return new YoutubeFeedItem(data);
};
