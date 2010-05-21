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


