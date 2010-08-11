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
	latLngBounds: null,
	searchFilter: null,
	latLng: null,

    initialize: function(searchFilter) {
		console.log("hi");
		if(searchFilter.location == null){
			var lat = 1;
			var lng = 1;
			console.log(lat + " default", lng);
			}
		else{
			var lat = searchFilter.location.lat;
			var lng = searchFilter.location.lng;
			console.log(lat + " if location given", lng);
		}
		console.log(lat, lng);
		this.latLng = new google.maps.LatLng(lat, lng);
		
		this.size = {x: 4};
		

		
		if(searchFilter.location != null){
			console.log(searchFilter.location.bounds_b, searchFilter.location.bounds_r);
			console.log(searchFilter.location.bounds_t, searchFilter.location.bounds_l);
			var NELatLng = new google.maps.LatLng(searchFilter.location.bounds_b, searchFilter.location.bounds_l);
			var SWLatLng = new google.maps.LatLng(searchFilter.location.bounds_t, searchFilter.location.bounds_r);
			this.latLngBounds = new google.maps.LatLngBounds(NELatLng, SWLatLng);
		} 
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
		
		this.displayBox.addEvent('preview', (function() {
			var map = new google.maps.Map(mapElement, myOptions);
			map.fitBounds(this.latLngBounds);
		}).bind(this));
		
        return new Element('div', {
            'class': 'Map'
        }).adopt([mapElement]);
    },

    /**
     * Builds a feed item content div for insertion into the modal box once
     * clicked
     */
    makeContent: function() {
		var mapElement = new Element('div', {styles:{width: 800, height: 600}});
		
		var myOptions = {
			zoom: 8,
			center: this.latLng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		
		// There was an error if the map was created before it was displayed
		this.displayBox.addEvent('display', (function() {
			var map = new google.maps.Map(mapElement, myOptions);
			map.fitBounds(this.latLngBounds);
			
			//Obtain coodinates from a click
			google.maps.event.addListener(map, 'click', function(event) {
				console.log(event);
				var clicked_lat = event.latLng.lat();
				var clicked_lng = event.latLng.lng();
				
				var latlng = new google.maps.LatLng(clicked_lat, clicked_lng);
				geocoder = new google.maps.Geocoder();
				geocoder.geocode({'latLng': latlng}, function(results, status) {
					console.log(arguments);
					if (status == google.maps.GeocoderStatus.OK) {
						if (results[1]) {
							address.set('text', results[1].formatted_address);
						}
					} else {
						alert("Geocoder failed due to: " + status);
					}
				});

				
			}); // end click function
		}).bind(this));
		
		var address = new Element('p');


        return new Element('div', {
            'class': 'Map'
        }).adopt([mapElement, address]);
    }
});
