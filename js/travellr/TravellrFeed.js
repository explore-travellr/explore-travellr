var TravellrFeed = new Class({
    Extends: Feed,

    PER_PAGE: 10,

    search: function(searchFilter) {

        // TODO: Search for tags individually if nothing is found when searching for them all

        var tags = "";
        searchFilter.tags.each(function(tag) {
            tags = tags + tag.stub + " ";
        });

        new Request.JSONP({
            url: 'http://api.travellr.com/explore_travellr/questions',
            data: {
                location_id: searchFilter.location.id,
                tags: tags,
                page: 1,
                per_page: TravellrFeed.PER_PAGE
            },
            onComplete: (function(data) {
                data.each(function(questionData) {
                    var feedItem = new TravellrFeedItem(questionData);
                    this.feedItems.push(feedItem);
                }, this);

                this.feedReady();
            }).bind(this)
        }).send();
    }

});