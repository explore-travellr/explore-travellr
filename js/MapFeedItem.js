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
     * Variable: base
     * To hold the string for the hyperlink to google maps
     */	
    base: 'http://maps.google.com/maps/api/staticmap?',
	
    /**
     * Function: initialize
     * Sets the parameter to a instance variable then sets the map lat, lng, bounds
     * and zoom
     *
     * Parameters:
     *     searchBox - to add an event to searchbox to find map
     */
    initialize: function(searchBox) {
		//editted by nat and clare
		//maps/api/staticmap?'+ 'center=' + lat + ',' + lng + '&zoom=' + zoom + '&sensor=false&size=' + width + 'x' + height + '&maptype=terrain
		//this.url needs to be modified to add location lat and long parameters based off search by user
		this.url = "http://maps.google.com";
		this.size = { x: 4 };
		
		searchBox.addEvent('search', (function(searchFilter) {
		
			if (searchFilter.location !== null) {
				//searchFilter for preview map
				this.lat = searchFilter.location.lat;
				this.lng = searchFilter.location.lng;
				//search filter for content map
				var NELatLng = new google.maps.LatLng(searchFilter.location.bounds_b, searchFilter.location.bounds_l);
				var SWLatLng = new google.maps.LatLng(searchFilter.location.bounds_t, searchFilter.location.bounds_r);
				this.latLngBounds = new google.maps.LatLngBounds(NELatLng, SWLatLng);
			} else {
				this.latLngBounds = null;
			}

			if (this.img) {
				this.img.src = this.makeImgSource();
			}
		}).bind(this));
    },
	
    /**
     * Function: makeImgSource
     * Code by Jai of travellr
     * http://groups.google.com/group/google-maps-js-api-v3/browse_thread/thread/43958790eafe037f/66e889029c555bee?pli=1
     */
    makeImgSource: function() {
        var lat, lng, zoom;
        var width = 380;
        var height = 380;

        //function to set appropriate zoom level
        if (this.latLngBounds) {
            var magic = 0.703119412486786;
            var bounds_t = this.latLngBounds.getNorthEast().lng();
            var bounds_b = this.latLngBounds.getSouthWest().lng();
            var bounds_l = this.latLngBounds.getNorthEast().lat();
            var bounds_r = this.latLngBounds.getSouthWest().lat();

            var dlat = bounds_t - bounds_b;
            var dlon;

			if (bounds_l < bounds_r) {
               dlon = bounds_r - bounds_l;
            } else {
               dlon = 360 - bounds_l + bounds_r;
            }

            var z0 = (Math.log(magic * height / dlat) / Math.log(2)).ceil();
            var z1 = (Math.log(magic * width / dlon) / Math.log(2)).ceil();

            zoom = z1 ? ((z1 > z0) ? z0 : z1) : z0;
            lat = this.lat;
            lng = this.lng;
            //default zoom level (if no location is searched)
        } else {
            zoom = 1;
            lat = 0;
            lng = 22;
        }
        return this.base + 'center=' + lat + ',' + lng + '&zoom=' + zoom + '&sensor=false&size=' + width + 'x' + height + '&maptype=terrain';
    },
	
    /**
	 * Function: makePreview
	 * Builds a <MooTools::Element> containing a preview of this <MapFeedItem>
	 *
	 * Returns:
	 *     A <MooTools::Element> containing a preview of this <MapFeedItem>
	 */
    makePreview: function() {
        this.img = new Element('img', {styles: {width: 'auto'},
            src: this.makeImgSource(),
			title: 'A Google map of your searched location, click to interact with'
        });

        return new Element('div', {
            'class': 'map'
        }).adopt(this.img);
    },
	
    /**
     * Function: makeContent
     * Builds a <MooTools::Element> with the contents of this <MapFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> with the contents of this <MapFeedItem>
     */
    makeContent: function() {
        var mapElement = new Element('div', { styles: { width: 600, height: 500} });

        var myOptions = {
            zoom: 1,
            center: new google.maps.LatLng(0, 0),
	    streetViewControl : true,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };

        // There was an error if the map was created before it was displayed
        this.displayBox.addEvent('display', (function() {
            var map = new google.maps.Map(mapElement, myOptions);
          
            if (this.latLngBounds) {
                map.fitBounds(this.latLngBounds);
                map.setZoom(map.getZoom() + 1);
			}
			/*Obtain coodinates from a click GEOCODE
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
            }); */
        }).bind(this));

        var address = new Element('p');

        return new Element('div', {
            'class': 'Map'
        }).adopt([mapElement, address]);
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
Class: MapFeedItem.unserialize
   Returns the map, ready to be unserialized

Extends:
   <MapFeedItem>
*/
MapFeedItem.unserialize = function(data) {
    return new MapFeedItem(data);
};
