/*
Title: loader.js
Loads the Explore.travellr application and some Native type extentions
*/
/*
 * Class: MooTools::String
 * Extensions of the MooTools String class
 *
 * See Also:
 *     - <JS::String>
 *     - <MooTools>
 *     - <http://mootools.net/docs/core/Native/String/>
 */
 
String.implement({

    /**
     * Function: newlineToBr
     * Converts all new line characters (\r or \n) to a <br /> Element. It then
     * converts all remaining chunks of text in to HTML text nodes
     *
     * Returns:
     *     The string, converted into an array of HTML text nodes seperated by <br /> <MooTools::Elements>
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
     * Function: tweetify
     * Converts links, #hashtags and @usernames to <a> Elements linked to their twitter URL.
     * Modified from <http://davidwalsh.name>
     * 
     * TODO: Make this return HTML objects, instead of a string
     *
     * Returns:
     *     A the string with URLs, #hashtags and @usernames replaced by anchors
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
     * Function: truncateText
     * Truncates the <String> to the specified maximum length. The terminator is
     * appended to the end if the <String> is truncated. The terminator defautls
     * to ellipsis (...)
     *
     * Parameters:
     *     upperBound - The maximum length of the <String>
     *     terminator - The terminator <String> to use if this <String> is truncated. Defaults to (...).
     *
     * Returns:
     *     A new truncated <String>
     */
    truncateText: function(upperBound, terminator){
        terminator = $pick(terminator, '...');
        if(this.length >= upperBound){
            return this.substring(0, upperBound - terminator.length) + terminator;
        }
        else{
            return this.substring(0, this.length);
        }
    }

});

/*
 * Class: MooTools::Array
 * Extensions of the MooTools Array class
 *
 * See Also:
 *     - <JS::Array>
 *     - <MooTools>
 *     - <http://mootools.net/docs/core/Native/Array>
 */
Array.implement({

    /**
    * Function: getRandomKey
    * Returns a random key from the array.
    *
    * Returns:
    *     A random key.
    */
    getRandomKey: function() {
        return $random(0, this.length - 1);
    },

    /**
    * Function: removeRandom
    * Removes and returns a random value from the array
    *
    * Returns:
    *     The removed item
    */
    removeRandom: function() {
        var index = this.getRandomKey();
        splice = this.splice(index, 1);
        return splice[0];
    },
});


$extend(window, {
    atBottom: function(margin) {
        return this.getScroll().y >= this.getScrollSize().y - this.getSize().y - (margin || 0);
    }
});

window.addEvent('domready', function() {
    // Initialize the main classes
    var searchBox = new SearchBox('searchField');
    var container = new Container('container', searchBox);

    var scrapbook = new Scrapbook({
        button: $('favourites_button'),
        folderDropdown: $('favourites_dropdown'),
        folderWrapper: $('favourites_folders'),
        folderAdd: $('favourites_add_folder'),
        onShown: function() {
            container.hide();
        },
        onHidden: function() {
            container.show();
        }
    });
    var feedToggle = new FeedToggle('feedToggle');

    // Initialize the feed classes.
    // Add a feed to the list to automatically set it up.
    var feeds = [FlickrFeed]; //[MapFeed, TravellrFeed, TwitterFeed, FlickrFeed, WorldNomadsFeed, GeckoFeed, TravellersPointFeed];
    feeds.each(function(AFeedClass) {
        var feed = new AFeedClass(searchBox, container, scrapbook);
        feedToggle.addFeed(feed);
    });

    // Grab the search string from the #fragment or ?search= get parameter
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
