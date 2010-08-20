/*
Class: flickr.FlickrFeed
    Fetches feed data from Flickr photo streams

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
   - <FlickrFeedItem>
*/

var VimeoFeed = new Class({
    
    Implements: [Options, Events],
    Extends: Feed,

    /**
     * Variable: name
     * The name of this <Feed>, for use in the GUI
     */
    name: 'Vimeo',

    /**
     * Function: search
     * Search the feed for items relating to the search terms. Calls
     * makeFeedItems on success.
     *
     * Paramaters:
     *     searchFilter - The search filter to filter results with
     */
    search: function(searchFilter) {
        this.empty();
        
        var tags = [];
			
        searchFilter.tags.each(function(tag) {
            tags.push(tag.name);
        });
        
		tags = tags.join(',');
		
		//randomizer
		var nonce = [];
		(11).times(function() {
			nonce.push(String.fromCharCode($random(97, 122)));
		});
		nonce = nonce.join('');

		//start of copied code
		var reserved = ['\\!','\\*',"\\'", '\\(','\\)','\\;','\\:','\\@','\\&','\\=','\\+','\\$','\\,','\\/', '\\?', '\\#','\\[','\\]'];
		var replace = ['%21','%2A', '%27', '%28', '%29', '%3B', '%3A', '%40', '%26', '%3D', '%2B', '%24', '%2C', '%2F', '%3F', '%23', '%5B', '%5D'];
		var time = Math.floor($time() / 1000);
		var baseUrl = 'GET&http://vimeo.com/api/rest/v2/?format=jsonp&full_response=1&method=vimeo.videos.search&per_page=50&query=' + tags + '&sort=most_liked&oauth_consumer_key=f2faad00c3d6579c4059d0c81e6d5dcf&oauth_nonce=' + nonce + '&oauth_signature_method=DHMAC-SHA1&oauth_timestamp=' + time + '&oauth_version=1.0'; //base string
		var secret = 'd2f673deca5fb882&'; 
		
		for(var i = 0, l = reserved.length; i < l; i++)
		{
			var re = new RegExp(reserved[i],"g");
			baseUrl = baseUrl.replace(re, replace[i]);
		}
		
		var newCode = Crypto.HMAC(Crypto.SHA1, baseUrl, secret);
		//64 encode
		
		var sig = window.btoa(newCode);
		for(var i = 0, l = reserved.length; i < l; i++)
		{
			var re = new RegExp(reserved[i],"g");
			sig = sig.replace(re, replace[i]);
		}
		var key = 'f2faad00c3d6579c4059d0c81e6d5dcf';
		new Request.JSONP({
			'url': 'http://vimeo.com/oauth/request_token',
			'data': {
				'format': 'jsonp',
				'full_response': 1,
				'method':'vimeo.videos.search',
				'per_page': 50,
				'query': tags,
				'sort': 'most_liked',
				'oauth_consumer_key': key,
				'oauth_nonce': nonce,
				'oauth_timestamp': time,
				'oauth_signature_method': 'DHMAC-SHA1',
				'oauth_signature': sig,
				'oauth_version': '1.0'  //end of copied code
			},
            onSuccess: this.makeFeedItems.bind(this)
        }).send();
		//end of copied code
		
    },

    /**
     * Function: makeFeedItems
     * Makes the individual <FlickrFeedItems> by sending the each photo
     * object of the response object to the <FlickrFeedItem> class and then
     * pushing each of them onto the <Feed::feedItems> array
     *
     * Paramaters:
     *     response - object returned by the flickr call
     */

	makeFeedItems: function(response) {
        var outstanding = 1;
        var feedItemReady = (function() {
            outstanding = outstanding - 1;
            if (outstanding === 0) {
                this.feedReady();
            }
        }).bind(this);

        this.response = response.videos;

        if($chk(this.response)) {
            response.videos.video.each(function(data) {
                outstanding = outstanding + 1;
                var feedItem = new VimeoFeedItem(data, {onReady: feedItemReady});
                this.feedItems.push(feedItem);
            }, this);
        }

        // By calling it here, it still works when there are no feed items
        feedItemReady();
    }
});
