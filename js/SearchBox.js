/*
Class: SearchBox
    A <SearchBox> listens to a <MooTools::Element> for changes, and makes a new
    search where appropriate. <Feeds>, amongst other classes, can listen to the
    search event for new searches.

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - <MooTools::core> 1.2.4 or higher
   - <MooTools::more> 1.2.4.4 RC1 or higher
*/

var SearchBox = new Class({

    /**
     * Event: search
     * Fired when a new search is created. A <SearchFilter> is sent as the event
     * arguments
     *
     * Parameters:
     *     searchFilter - A <SearchFilter> containing the search parameters
     */

    Implements: Events,

    /**
     * Variable: element
     * The <MooTools::Element> this is listening to.
     */
    element: null,

    /**
     * Function: initialize
     * Create a new SearchBox. The SearchBox will listen to the supplied element
     * for its searches
     *
     * Parameters:
     *     element - {Element} The input field to listen to for searches
     */
    initialize: function(element) {
        this.element = $(element);
        
        this.form = this.element.getParent('form');
        
        this.form.addEvent('submit', (function(event) {
		
			if (!searchString) {
            $$('#slogan').fade('out');
            event.stop();}
			
            this.search(this.element.get('value'));
        }).bind(this));
    },

    /**
     * Function: search
     * Search for the supplied string. A searchFitler is created based upon the
     * search string. The SearchBox then fires the search event, with the search
     * filter being the event details. Feeds and other objects can listen to
     * this event.
     *
     * Parameters:
     *     searchString - {String} The string to search for.
     */
    search: function(searchString) {
        if (!searchString) {
           return;
        }
        location.hash = searchString;
        this.searchFilter = new SearchFilter(searchString);
        this.searchFilter.addEvent('ready', (function() {
        this.fireEvent('search', [this.searchFilter]);
        }).bind(this));
     }  
});

