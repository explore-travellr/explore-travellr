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

    Implements: [Options, Events],

    element: null,

    initialize: function(element) {
        this.element = $(element);
    	
        this.form = this.element.getParent('form');
    	
        this.form.addEvent('submit', (function(event) {
            event.stop();
            this.search(this.element.get('value'));
        }).bind(this));
    },

    //called when the search query is submitted. Creates a SearchFilter and calls Feed: each on all feeds.
    search: function(searchString) {  
        location.hash = searchString;
        this.searchFilter = new SearchFilter(searchString);
        this.searchFilter.addEvent('ready', (function() {
            this.fireEvent('search', [this.searchFilter]);
        }).bind(this));
    }
    
});

