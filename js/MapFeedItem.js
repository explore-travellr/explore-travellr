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
	
    /**
     * Variable: name
     * The name of this <FeedItem> class, used in the GUI
     */
    name: 'MapFeedItem',
	
    /**
     * Variable: latLngBounds
     * The lat long bounds returned from google maps.
     */	
    latLngBounds: null,
	
    /**
     * Variable: map
     * To hold the map object so it can be reset when a new search is made
     */	
	map: null,
	
    /**
     * Function: initialize
     * Sets the parameter to a instance variable then sets the map lat, lng, bounds
     * and zoom
     *
     * Parameters:
     *     searchBox - to add an event to searchbox to find map
     */
    initialize: function(searchBox) {

		this.size = { x: 4 };
		
		searchBox.addEvent('search', (function(searchFilter) {
		
			if (searchFilter.location != null) {
				var NELatLng = new google.maps.LatLng(searchFilter.location.bounds_b, searchFilter.location.bounds_l);
				var SWLatLng = new google.maps.LatLng(searchFilter.location.bounds_t, searchFilter.location.bounds_r);
				this.latLngBounds = new google.maps.LatLngBounds(NELatLng, SWLatLng);
			} else {
				this.latLngBounds = null;
			}

			if (this.map) {
				if (this.latLngBounds) {
					this.map.fitBounds(this.latLngBounds);
				} else {
					this.map.setCenter(new google.maps.LatLng(0, 0));
					this.map.setZoom(0);
				}
			}


		}).bind(this));
    },
	
    /**
	 * Function: makePreview
	 * Builds a <MooTools::Element> containing a preview of this <MapFeedItem>
	 *
	 * Returns:
	 *     A <MooTools::Element> containing a preview of this <MapFeedItem>
	 */
    makePreview: function() {
        var mapElement = new Element('div', { styles: { height: 400} });

        var myOptions = {
            zoom: 0,
            center: new google.maps.LatLng(0, 0),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.displayBox.addEvent('preview', (function() {
            var map = new google.maps.Map(mapElement, myOptions);
			this.map = map;
            if (this.latLngBounds) {
                map.fitBounds(this.latLngBounds);
            }
        }).bind(this));

        return new Element('div', {
            'class': 'Map'
        }).adopt([mapElement]);
    },
	
    /**
     * Function: makeContent
     * Builds a <MooTools::Element> with the contents of this <MapFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> with the contents of this <MapFeedItem>
     */
    makeContent: function() {
        var mapElement = new Element('div', { styles: { width: 800, height: 600} });

        var myOptions = {
            zoom: 0,
            center: new google.maps.LatLng(0, 0),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // There was an error if the map was created before it was displayed
        this.displayBox.addEvent('display', (function() {
            var map = new google.maps.Map(mapElement, myOptions);
            if (this.latLngBounds) {
                map.fitBounds(this.latLngBounds);
            }

            //Obtain coodinates from a click
            google.maps.event.addListener(map, 'click', function(event) {
                var clicked_lat = event.latLng.lat();
                var clicked_lng = event.latLng.lng();

                var latlng = new google.maps.LatLng(clicked_lat, clicked_lng);
                geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'latLng': latlng }, function(results, status) {
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
