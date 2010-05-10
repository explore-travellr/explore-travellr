var SearchFilter = new Class({
    Implements: Events,

    initialize: function(searchString) {

        new Request.JSONP({
            url: 'http://api.travellr.com/explore_travellr/document', 
              
              data: {
                text: searchString
            },
            onComplete: (function(data) {
            	this.location = data.location_matches[0] || null;
            	
            	var tagArray = [];
            	data.topic_matches.each(function(tag) {
            		tagArray.push(tag.topic);
            	})
            	this.tags = tagArray;
            	            	
            	this.fireEvent('ready');
            }).bind(this)
        }).send();
    }

});


