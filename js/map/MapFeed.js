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
		this.empty();
		//console.log(searchFilter);
		
        this.parent();
		
		var mapFeedItem = new MapFeedItem(searchFilter);
		
		this.feedItems.push(mapFeedItem);
		
		this.feedReady();
    }
 });
