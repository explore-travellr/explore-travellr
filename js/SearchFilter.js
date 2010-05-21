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

    initialize: function(searchString) {

        this.searchString = searchString;

        new Request.JSONP({
            url: 'http://api.travellr.com/explore_travellr/document', 

            data: {
                text: searchString
            },
            onComplete: (function(data) {

                this.location = (data.location_matches[0] ? data.location_matches[0].location : null);

                var tagArray = [];
                data.topic_matches.each(function(tag) {
                    tagArray.push(tag.topic);
                })
                this.tags = tagArray;

                this.noun_phrases = data.noun_phrases;

                this.fireEvent('ready');
            }).bind(this)
        }).send();
    }

});


