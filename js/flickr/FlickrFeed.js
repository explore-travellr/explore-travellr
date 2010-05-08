var FlickrFeed = new Class({

    Extends: Feed,

    initialize: function() {},

    search: function(searchFilter) {

        // TODO: Search for tags individually if nothing is found when searching for them all

                console.log('searchFilter: '+searchFilter.tag);
        //
        //        var tags = "";
        //        searchFilter.tags.each(function(tag) {
        //            tags = tags + tag + " ";
        //        });

        new Request.JSONP({
            url: 'http://api.flickr.com/services/rest/',
            data: {
                method: 'flickr.photos.search',
                api_key: '49dbf1eebc2e9dd4ae02a97d074d83fc',
                format: 'json',
                tags: '(' + searchFilter.tag + ')',
                nojsoncallback: 1,
                per_page: 10
            },
            //callbackKey: 'jsoncallback',
            onComplete: (function(data) {
                console.log(data);
                //this.jsonFlickrApi(data);
                //jsonFlickrApi(data);
                //jsoncallback=jsonFlickrApi(data);
                data.photos.photo.each(function(photoData) {
                    var feedItem = new FlickrFeedItem(photoData);
                    this.feedItems.push(feedItem);
                }, this);

                this.feedReady();
            }).bind(this)
        }).send();
    },

    //tesing function for document display
    feedReady: function() {
        this.feedItems.each(function(feedItem) {
            $(document.body).grab(feedItem.getContent());
        });
    }

//    jsonFlickrApi: function(rsp) {
//
//        console.log("ja");
//    }

});