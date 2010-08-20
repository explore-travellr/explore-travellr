/*
Class: SearchFilter
   SearchFilter - DESC TODO

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - MooTools-core 1.2.4 or higher
   - MooTools-more 1.2.4.4 RC1 or higher
*/


var SearchFilter = new Class({
    Implements: Events,
    /**
     * Event: searchReady
     * Fired when the data has been retrieved from Travellr
     */

    /**
     * Variable: searchString
     * The <JS::String> that was searched for
     */
    searchString: null,

    /**
     * Variable: location
     * The geographic location of the search. Can be null
     */
    location: null,

    /**
     * Variable: tags
     * An <JS::Array> of the Travellr tags found in the search. Can be empty.
     */
    tags: null,
    
    /**
     * Variable: nounPhrase
     * A <JS::Array> of the noun phrases found in the search. Can be empty.
     */
    nounPhrases: null,

    /**
     * Constructor: initialize
     * Creates a new <SearchFilter>. It will search for the supplied search
     * string. The <SearchFilters> data fields will be filled with the results.
     *
     * Parameters:
     *     searchString - {String} The search string to gather data about
     */
    initialize: function(searchString) {
        this.searchString = searchString;

        // Send off the search
        new Request.JSONP({
            url: 'http://api.travellr.com/explore_travellr/document',
            data: {
                text: searchString
            },

            // Gather data, and fire the ready event when the search is done.
            onComplete: (function(data) {
                this.location = (data.location_matches[0] ? data.location_matches[0].location : null);

                var tagArray = [];
                data.topic_matches.each(function(tag) {
                    tagArray.push(tag.topic);
                })
                this.tags = tagArray;

                this.nounPhrases = data.noun_phrases;

                this.fireEvent('ready');
            }).bind(this)
        }).send();
    }
    
});


