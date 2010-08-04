String.implement({
    /**
     * Converts newline characters in the string to <br />
     *
     * Converts all new line characters (\r or \n) to a <br /> Element. It then
     * converts
     *
     * @return The string, converted into an array of HTML text nodes seperated
     *         by <br /> Elements
     * @type Array
     */
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
     * Converts links, #hashtags and @usernames to <a> Elements linked to their
     * twitter URLs.
     *
     * Converts links, #hashtags and @usernames to <a> Elements linked to their
     * twitter URLs.
     * Modified from {@link davidwalsh.name}
     * 
     * TODO: Make this return HTML objects, instead of a string
     *
     * @return An array of HTML objects based upon the string.
     */
    tweetify: function () {
        // modified from TwitterGitter by David Walsh (davidwalsh.name)
        // courtesy of Jeremy Parrish (rrish.org)
        var str = this.replace(/(https?:\/\/[\w\-:;?&=+.%#\/]+)/gi, '<a href="$1">$1</a>');
        str = str.replace(/(^|\W)@(\w+)/g, '$1<a href="http://twitter.com/$2">@$2</a>');
        str = str.replace(/(^|\W)#(\w+)/g, '$1#<a href="http://search.twitter.com/search?q=%23$2">$2</a>');
        return str;
    },
    
    /**
     * Truncates the string to a maximum length
     *
     * Truncates the string to the specified maximum length. The terminator is
     * appended to the end if the string is truncated. The terminator defautls
     * to ellipsis (...)
     *
     * @param upperBound {Number} The maximum length of the string
     * @param terminator {String} The terminator to use if the string is
     *         truncated. Defaults to (...).
     * @return The truncated string
     * @type String
     */
    truncateText: function(upperBound, terminator){
        terminator = $pick(terminator, '...');
        if(this.length >= upperBound){
            return this.substring(0, upperBound - terminator.length) + terminator;
        }
        else{
            return this;
        }
    }
});

Array.implement({
    /**
     * Returns a random key from the array.
     *
     * @return A random key.
     * @type Number
     */
    getRandomKey: function() {
        return $random(0, this.length - 1);
    },
    
    /**
     * Removes and returns a random value from the array
     *
     * @return The removed item
     */
    removeRandom: function() {
        var index = this.getRandomKey();
        splice = this.splice(index, 1);
        return splice[0];
    }
});


window.addEvent('domready', function() {
    // Initialize the main classes
    var searchBox = new SearchBox('searchField');
    var container = new Container('container', searchBox);
    var feedToggle = new FeedToggle('feedToggle');

    // Initialize the feed classes.
    // Add a feed to the list to automatically set it up.
    var feeds = [TravellrFeed, TwitterFeed, FlickrFeed, WorldNomadsFeed, GeckoTipsFeed, GeckoReviewFeed, TravellersPointFeed, MapFeed];
    feeds.each(function(AFeedClass) {
        var feed = new AFeedClass(searchBox, container);
        feedToggle.addFeed(feed);
    });

    // Grab the search string from the #fragment or ?search= get paramater
    var uri = new URI(location);
    var searchString = (uri.get('fragment') || uri.getData('search'));
    if (searchString) {
        // Spaces are encoded in URIs. This replaces + or %20 with spaces.
        searchString = searchString.replace(/\+|%20/g, ' ');

        // Search for the string
        $('searchField').set('value', searchString);
        searchBox.search(searchString);
    }
});
