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
		var mapElement = new Element('div', {styles:{height: 400}});
		
		var myOptions = {
			zoom: 8,
			center: this.latLng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		
		var map = new google.maps.Map(mapElement, myOptions);
		
        return new Element('div', {
            'class': 'Map'
        }).adopt([mapElement]);
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
		var address = new Element('p');
		
		//Trying to obtain coodinates from a click
		google.maps.event.addListener(map, 'click', function(event) {
			console.log(event);
			var clicked_lat = event.latLng.lat();
			var clicked_lng = event.latLng.lng();
			new Request.JSONP({
				url: 'http://maps.google.com/maps/api/geocode/jsonp',
					data: {
					latlng: clicked_lat + "," + clicked_lng,
					sensor: false
				},
				
				onSuccess: 	function(){
					address.set('text', this.results.formatted_address);
				}
			}).send();
			
		}); // end click function

        return new Element('div', {
            'class': 'Map'
        }).adopt([mapElement, address]);
    }
});
