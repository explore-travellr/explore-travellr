/*
Script: SearchBox.js
   SearchBox - DESC TODO

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - MooTools-core 1.2.4 or higher
   - MooTools-more 1.2.4.4 RC1 or higher
*/

var SearchBox = new Class({

    Implements: Events,

    element: null,

    /**
     * Create a new SearchBox. The SearchBox will listen to the supplied element
     * for its searches
     *
     * @param element {Element} The input field to listen to for searches
     */
    initialize: function(element) {
        this.element = $(element);
    	
        this.form = this.element.getParent('form');
    	
        this.form.addEvent('submit', (function(event) {
            event.stop();
            this.search(this.element.get('value'));
        }).bind(this));
    },

    /**
     * Search for a given string.
     *
     * Search for the supplied string. A searchFitler is created based upon the
     * search string. The SearchBox then fires the search event, with the search
     * filter being the event details. Feeds and other objects can listen to
     * this event.
     *
     * @param searchString {String} The string to search for.
     */
    search: function(searchString) {  
        location.hash = searchString;
        this.searchFilter = new SearchFilter(searchString);
        this.searchFilter.addEvent('ready', (function() {
            this.fireEvent('search', [this.searchFilter]);
        }).bind(this));
    }
    
});

