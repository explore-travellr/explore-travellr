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

    name: 'MapFeedItem',

    initialize: function(latLng) {
		this.latLng = latLng;
		this.size = {x: 4};
    },

    /**
     * Builds a feed item preview to go in the displayBox within the container
     */
    makePreview: function() {
        return new Element('div', {text: 'View google maps'});
    },

    /**
     * Builds a feed item content div for insertion into the modal box once
     * clicked
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
