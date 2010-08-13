/*
Script: FlickrFeed.js
   FlickrFeed - MooTools based Flickr feed generator

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - MooTools-core 1.2.4 or higher
   - MooTools-more 1.2.4.4 RC1 or higher
   - Request/Request.JSONP
   - Feed Class
   - FlickrFeedItem Class
*/

var FlickrFeed = new Class({
    
    Extends: Feed,

    itemsCalled: null,

    Implements: [Options, Events],
    options: {
        size: 'm',
        method: 'flickr.photos.search',
        apikey: '49dbf1eebc2e9dd4ae02a97d074d83fc'
    },

    requests: 0,

    name: 'Flickr',

    /**
     * Search the feed for items relating to the search terms. Calls
     * makeFeedItems on success.
     *
     * @param searchFilter The search filter to filter results with
     */
    search: function(searchFilter) {
        this.parent();
        
        var tags = [];
		var groups = [
			"642578@N20", "651467@N20", "95408346@N00","642578@N20",
			"651467@N20", "95408346@N00", "1054980@N25", "80235331@N00",
			"64181070@N00", "391332@N25", "616189@N23", "633730@N24",
			"16984497@N00", "376701@N20", "342614@N21", "23966700@N00",
			"62583794@N00", "364018@N23", "63655619@N00", "16816761@N00",
			"338125@N24", "74744754@N00", "62647754@N00", "81913447@N00",
			"598803@N20", "43186709@N00", "1124795@N23", "651467@N20",
			"11488522@N00", "294286@N25", "631401@N25", "46306708@N00",
			"34355725@N02", "21776702@N07", "46306708@N00", "55323305@N00",
			"88923587@N00", "46306708@N00", "45839300@N00", "63004124@N00",
			"52838144@N00", "48227644@N00", "44346430@N00", "11806675@N00",
			"32356708@N05", "44124303046@N01", "52240442714@N01", "38531420@N00",
			"352933@N20", "88145536@N00", "666749@N24", "844972@N25", "79091893@N00",
			"462501@N21", "406846@N25", "463434@N25", "40285293@N00", "68067310@N00", 
			"339018@N21", "70793332@N00", "17456965@N00", "376701@N20",
			"48926546@N00", "95408346@N00", "64228671@N00", "46306708@N00",
			"642578@N20", "1425956@N00", "97947309@N00", "13433297@N00", "77091372@N00",
			"979035@N25", "78336205@N00", "60853857@N00", "99936649@N00", "81913447@N00"
		];
		
        this.itemsCalled = $random(4,8);
			
        searchFilter.tags.each(function(tag) {
            tags.push(tag.name);
        });
        tags = tags.join(',');
        
        new Request.JSONP({
            url: 'http://api.flickr.com/services/rest/',
                data: {
                api_key: 	this.options.apikey,
                method: 	this.options.method,
                per_page: 	this.itemsCalled,
                tags:           tags,
                woe_id:         (searchFilter.location ? searchFilter.location.woe_id : null),
                format: 	'json',
                sort:           'relevance',
				group_id: groups
            },
            callbackKey: 	'jsoncallback',
            onSuccess: 	this.makeFeedItems.bind(this)
        }).send();
    },

    /**
     * Makes the individual flickr feed items by sending the each photo
     * object of the response object to the FlickrFeedItem class and then
     * pushing each of them onto a feedItems array
     *
     * @param response object returned by the flickr call
     */
    makeFeedItems: function(response) {

        this.response = response.photos;

        if($chk(this.response)) {
            response.photos.photo.each(function(data) {
                var feedItem = new FlickrFeedItem(data);
                this.feedItems.push(feedItem);
            }, this);
        }

        this.feedReady();
    }
});
