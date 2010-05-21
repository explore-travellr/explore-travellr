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

    search: function(searchString) {
    //called when the search query is submitted. Creates a SearchFilter and calls Feed: each on all feeds.
        this.searchFilter = new SearchFilter(searchString);
        this.searchFilter.addEvent('ready', (function() {
            this.fireEvent('search', [this.searchFilter]);
        }).bind(this));
    }
    
});

