/*
Script: SearchFilter.js
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
     * The string that was searched for
     */
    searchString: null,

    /**
     * The location of the search. Can be null
     */
    location: null,

    /**
     * An Array of the Travellr tags found in the search. Can be empty.
     * @type Array
     */
    tags: null,
    
    /**
     * An Array of the noun phrases found in the search. Can be empty.
     * @type Array
     */
    nounPhrases: null,

    /**
     * Create a new SearchFilter, searching for the supplied search string.
     *
     * Creates a new SearchFilter. It will search for the supplied search
     * string, filling out its data fields with the results. Other objects can
     * listen for the ready event to know when the SearchFilter has gathered its
     * data
     *
     * @param searchString {String} The search string to gather data about
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


