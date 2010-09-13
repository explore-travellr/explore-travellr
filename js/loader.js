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

    var scrapbook = new Scrapbook({
        button: $('favourites_button'),
        folderDropdown: $('favourites_dropdown'),
        folderWrapper: $('favourites_folders'),
        folderAdd: $('favourites_add_folder')
    });

    var container = new Container('container', searchBox, scrapbook);
    scrapbook.addEvents({
        onShown: (function() {
            this.hide();
        }).bind(container),
        onHidden: (function() {
            this.show();
        }).bind(container)
    });
    var feedToggle = new FeedToggle('feedToggle');

    // Initialize the feed classes.
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
    $$('#japan').addEvents({ 
      'click': function(){
            var searchString = this.get('text');
             // Search for the string
              $('searchField').set('value', searchString);
              searchBox.search(searchString);
        }
    });
    
    var showModal = function(content) {

        //make a modal dialog
        var modalMask = new Element('div', { 'class': 'modalMask' });
        var modalClose = new Element('div', { 'class': 'close-button', text: 'Close' });
        var modal = new Element('div', { 'class': 'modal' });
        var contentWrapper = new Element('div', { 'class': 'content' });

        // Hide the containers
        modalMask.fade('hide');
        modal.fade('hide');

        contentWrapper.grab(content);

        modal.adopt([modalClose, contentWrapper]);

        $(document.body).grab(modalMask);
        $(document.body).grab(modal);

        // Position the box
        var viewPos = window.getScroll();
        var viewSize = window.getSize();

        var modalSize = modal.getSize();
        var documentSize = document.getScrollSize();

        var modalLocation = {
            x: viewPos.x + (viewSize.x - modalSize.x) / 2,
            y: viewPos.y + (viewSize.y - modalSize.y) / 2
        };
        modal.setPosition(modalLocation);

        modalMask.set('styles', { height: documentSize.y });

        // Show the containers
        modalMask.fade('0.8');
        modal.fade('in');

		// Add events to elements
		$$(modalClose, modalMask).addEvent('click', (function() {
		  closeModal(content,modal,modalMask,modalClose);
		}).bind(this));

		// Add events to window
		window.addEvent('keypress', (function(e) {
		  if(e.key == 'esc') {
				  closeModal(content,modal,modalMask,modalClose);
			  }
		}).bind(this));          
    };
	
    var closeModal = function(content,modal,modalMask,modalClose) {
		if (content.parentNode) {
			content.parentNode.removeChild(content);
		}
		modal.destroy();
		modalMask.destroy();
		modalClose.destroy();
		this.shown = false;		
	};
    
    (['about_us','partners','terms_and_conditions','contact_us']).each(function(id) {
      var content = $(id+ '_modal');
      $(id).addEvent('click', function() {
        content.setStyle('display', 'block');
        showModal(content);
      })
    });
    var lm = $('learn_more');
    var lmModal = $('about_us_modal');
    $(lm).addEvent('click', function() {
		lmModal.setStyle('display', 'block');
		showModal(lmModal);
    })
      
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

	$$('.toolbar_button').addEvents({
		'mouseover': showMenu,
		'mouseout': hideMenu,
		'click': showMenu
	});    
});








