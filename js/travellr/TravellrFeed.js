var TravellrFeed = new Class({
    Extends: Feed,

    PER_PAGE: 10,

    name: 'Travellr',
    
    search: function(searchFilter) {
        this.parent();
        // TODO: Search for tags individually if nothing is found when searching for them all

        if (!($chk(searchFilter.location) || searchFilter.tags.length !== 0)) {
            this.feedReady();
            return;
        }

        var tags = "";
        searchFilter.tags.each(function(tag) {
            tags = tags + tag.stemmed + " ";
        });

        new Request.JSONP({
            url: 'http://api.travellr.com/explore_travellr/questions',
            data: {
                location_id: (searchFilter.location ? searchFilter.location.id : null),
                tags: tags,
                page: 1,
                per_page: TravellrFeed.PER_PAGE
            },
            onComplete: (function(data) {
                
                data.each(function(questionData) {
                    var feedItem = new TravellrFeedItem(questionData);
                    this.feedItems.push(feedItem);
                }, this);

				this.feedItems.push(new TravellrFeedItem.Ask(searchFilter.location.id));
                this.feedReady();
            }).bind(this)
        }).send();
    }
});
