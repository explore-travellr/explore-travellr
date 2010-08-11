/*
Class: map.MapFeed
    Gets a stream of google maps by location

Extends:
    <Feed>

License:
    MIT-style license.

Copyright:
    Copyright (c) 2010 explore.travellr.com

Dependencies:
   - <MooTools::core> 1.2.4 or higher
   - <MooTools::more> 1.2.4.4 RC1 or higher
   - <MooTools::more> Request.JSONP
   - <map.MapFeedItem>
*/

var MapFeed = new Class({

    Extends: Feed,

    name: 'Map',

    /**
     * TODO
     */
    search: function(searchFilter) {
        this.parent();

		if (searchFilter.location == null) {
			this.feedReady();
			return;
		}
		
        var lat = searchFilter.location.lat;
        var lng = searchFilter.location.lng;
		
		var latLng = new google.maps.LatLng(lat, lng);
		
		var mapFeedItem = new MapFeedItem(latLng);
		
		this.feedItems.push(mapFeedItem);
		
		this.feedReady();
    }
 });
