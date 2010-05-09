var TwitterFeed = new Class({
    Extends: Feed,

    PER_PAGE: 3,

initialize: function() {},
    search: function(searchFilter) {

        // TODO: Search for tags individually if nothing is found when searching for them all

        var tags = "";
        searchFilter.tags.each(function(tag) {
            tags = tags + tag.stub + " ";
        });

       // TODO: Check whether the search query contains an activity or location and search accordingly
        new Request.JSONP({
            url: 'http://search.twitter.com/search.json',
            data: {
                geo_code: searchFilter.location.lat + "," + searchFilter.location.lng +",1mi",
                q: tags,
                page: 1,
                rpp: TwitterFeed.PER_PAGE
            },
            onComplete: (function(data) {
                console.log(data);
                /*
                data.each(function(questionData) {
                    var feedItem = new TravellrFeedItem(questionData);
                    this.feedItems.push(feedItem);
                }, this);

                this.feedReady();
                */
            }).bind(this),
            onFailure: function() {
                console.log(arguments);
            }

        }).send();
    }

});