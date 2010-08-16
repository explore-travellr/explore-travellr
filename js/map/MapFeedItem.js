/*
Script: MapFeedItem.js
   Displays the single google map retrieved by a <MapFeed>

Extends:
   <FeedItem>

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - <MooTools::core> 1.2.4 or higher
   - <MooTools::more> 1.2.4.4 RC1 or higher
   - <MapFeed>
*/

var MapFeedItem = new Class({

    Extends: FeedItem,

    /**
     * Variable: post
     * A <JS::Object> holding all the post data
     */
    latLng: null,

    /**
     * Variable: name
     * The name of this <FeedItem>, used in the GUI
     */
    name: 'MapFeedItem',

    /**
     * Consructor: initialize
     * Sets a new <MapFeedItem> with an image of the map
     *
     * Paramaters:
     *      feedObject - The object is associative array of keys related to the feedObject passed in
     */
    initialize: function(feedObject) {
        this.latLng = feedObject;
        this.size = {
            x: 4
        };
    },

    /**
     * Function: makePreview
     * Builds a <MooTools::Element> containing a preview of this <MapFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> containing a preview of this <MapFeedItem>
     */
    makePreview: function() {
        return new Element('div', {text: 'View google maps'});
    },

    /**
     * Function: makeContent
     * Builds a <MooTools::Element> with the content of this <MapFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> with the content of this <MapFeedItem>
     */
    makeContent: function() {
		var mapElement = new Element('div', {styles:{width: 600, height: 400}});		
		var myOptions = {
			zoom: 8,
			center: this.latLng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};		
		var map = new google.maps.Map(mapElement, myOptions);		
        return new Element('div', {
            'class': 'Map'
        }).adopt([mapElement]);
    }
});
