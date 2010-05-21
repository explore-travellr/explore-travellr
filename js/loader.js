String.implement({
    newlineToBr: function() {
        var bits = this.split(/(?:\r|\n|\r\n)/);
        var html = [];

        bits.each(function(bit) {
            if (html.length !== 0) {
                html.push(new Element('br'));
            }
            html.push(document.createTextNode(bit));
        });

        return html;
    },
    /**
     * Converts a string to an array of HTML objects, with links, #hashtags and @usernames linked
     * to their twitter URLs.
     *
     * @return An array of HTML objects based upon the string. The HTML array can be used by eg.
     * Element.adopt(String.tweetify());
     */
    tweetify: function () {
        // modified from TwitterGitter by David Walsh (davidwalsh.name)
        // courtesy of Jeremy Parrish (rrish.org)
        var str = this.replace(/(https?:\/\/[\w\-:;?&=+.%#\/]+)/gi, '<a href="$1">$1</a>');
        str = str.replace(/(^|\W)@(\w+)/g, '$1<a href="http://twitter.com/$2">@$2</a>');
        str = str.replace(/(^|\W)#(\w+)/g, '$1#<a href="http://search.twitter.com/search?q=%23$2">$2</a>');
        return str;
    } 
});

Array.implement({
	getRandomKey: function() {
		return $random(0, this.length - 1);
	},
	removeRandom: function() {
		var index = this.getRandomKey();
		    splice = this.splice(index, 1);
		return splice[0];
	}
});

window.addEvent('domready', function() {

    var searchBox = new SearchBox('searchField');
    var container = new Container('container', searchBox);
    var feedToggle = new FeedToggle('feedToggle');

    //feeds = [TravellrFeed, WorldNomadsFeed, TwitterFeed, FlickrFeed, WikiTravelFeed];
    var feeds = [TravellrFeed, TwitterFeed, FlickrFeed, WorldNomadsFeed];
    feeds.each(function(AFeedClass) {
        var feed = new AFeedClass(searchBox, container);
        feedToggle.addFeed(feed);
    });
    
    var searchString = location.href.toURI().getData('search').replace(/\+/g, ' ');
    if (searchString) {
        $('searchField').set('value', searchString);
        searchBox.search(searchString);
    }
        
});
