var TravellrFeed = new Class({
    Extends: Feed,

    search: function(searchFilter) {
        new Request({
            url: 'travellr.com/api.js',
            data: searchFilter,
            onComplete: function(data) {
                // Process data

                feedItemData.each(function(itemData) {
                    var feedItem = new TravellrFeedItem(itemData);
                    var displayBox = new DisplayBox(feedItem);
                    this.container.addDisplayBox(displayBox);
                });
            }
        })
    }
});