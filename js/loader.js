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
    }
});


$extend(window, {
    atBottom: function(margin) {
        return this.getScroll().y >= this.getScrollSize().y - this.getSize().y - (margin || 0);
    }
});

window.addEvent('domready', function() {

    //checks browser engine to see if compatible with application
    if(Browser.Engine.trident) {
        alert("Your browser, Internet Explorer, is not currently supported by our application. Please use Firefox, Chrome of Safari.");
    } else if(Browser.Engine.presto) {
        alert("Your browser, Opera, is not currently supported by our application. Please use Firefox, Chrome of Safari.");
    }



    // Initialize the main classes
    var searchBox = new SearchBox('searchField');

    var scrapbook = new Scrapbook({
        button: $('favourites_button'),
        folderDropdown: $('favourites_dropdown'),
        folderWrapper: $('favourites_folders'),
        folderAdd: $('favourites_add_folder')
    });

    var container = new Container('container', searchBox, scrapbook);
	container.hide();

    scrapbook.addEvents({
        onShown: (function() {
            this.hide();
        }).bind(container),
        onHidden: (function() {
            this.show();
        }).bind(container)
    });

    var feedToggle = new FeedToggle('feedToggle');

	var mapDisplayBox = new DisplayBox(new MapFeedItem(searchBox));
	container.addDisplayBox(mapDisplayBox);
	
	// Initialize the feed classes	
	// Add a feed to the list to automatically set it up.
    var feeds = [FlickrFeed, TwitterFeed, GeckoFeed, TravellersPointFeed, TravellrFeed, WorldNomadsFeed, YoutubeFeed];

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
    
    //Slogan - adds "Skiing in Japan" to the search field and starts searching
	
	var sampleSearches = [
		'Skiing in Japan',
		'Hiking in Switzerland',
		'Festivals in Germany',
		'Surfing in Sydney',
		'New York City',
		'Restaurants in Paris'
		];
		
	var arrayLength = sampleSearches.length;
	var searchNumber = Math.floor(Math.random()*arrayLength);

	$$('#sample_search').adopt([
            new Element('a').grab(new Element('a', {
                href: '#',
                text: sampleSearches[searchNumber],
				title: 'Use this term for your sample search, click away!'
            }))]);
	
	
    $$('#sample_search').addEvents({ 
      'click': function(){
            var searchString = this.get('text');
             // Search for the string
              $('searchField').set('value', searchString);
              searchBox.search(searchString);
        }
    });
      
	$$('.feed_toggle').addEvents({
		'click': function(){
			if($(this).hasClass('on')){
				$(this).removeClass('on');
				$(this).addClass('off');
			}
			else{
				$(this).removeClass('off');
				$(this).addClass('on');
			}
		}
	});

	//Hide & Display dropdown menus on moueover & mouseout
	$$('.dropdown').setStyle('display','none');

	var showMenu = function(event){
		event.stop();
		$(this).addClass('button_hover');
		$(this).getElement('.dropdown').setStyle('display','block');
	};

	var hideMenu = function(){
		$(this).removeClass('button_hover');
		$(this).getElement('.dropdown').setStyle('display','none');
	};

	//sets drop bar boolean as false on load
	var dropBarVisible = false;

	$$('#feed_button').addEvents({
		'mouseover': showMenu,
		'mouseout': hideMenu,
		'click': showMenu
	});  
	
});








