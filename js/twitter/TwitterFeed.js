var TwitterFeed = new Class({
    Extends: Feed,

    PER_PAGE: 3,

    name: 'Twitter',

    search: function(searchFilter) {
        this.parent();
        // TODO: Search for tags individually if nothing is found when searching for them all

        var tags = "";
        searchFilter.tags.each(function(tag) {
            tags = tags + tag.name + " ";
        });

        // TODO: Check whether the search query contains an activity or location and search accordingly
        new Request.JSONP({
            url: 'http://search.twitter.com/search.json',
            data: {
                geo_code: (searchFilter.location ? searchFilter.location.lat + "," + searchFilter.location.lng +",1mi" : null),
                q: searchFilter.searchString,
                lang: 'en',
                page: 1,
                rpp: this.PER_PAGE,
                result_type: 'recent' //results can also be popular or mixed
            },
            onComplete: (function(data) {
                if (data.results && $chk(data.results.length)) {
                    data.results.each(function(data) {
                        var feedItem = new TwitterFeedItem(data);
                        this.feedItems.push(feedItem);
                    }, this);
                }

                this.feedReady();
            }).bind(this)

        }).send();
    }

});
