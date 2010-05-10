String.implement({
    newlineToBr: function() {
        var bits = this.split(/(?:\r|\n|\r\n)/);
        var html = [];

        bits.each(function(bit) {
            if (html.length !== 0) {
                html.push(new Element('br'));
            }
            html.push(document.createTextNode(bit));
        });

        return html;
    }
});

window.addEvent('domready', function() {

    var searchBox = new SearchBox('searchBox');
    var container = new Container('container', searchBox);

    //feeds = [TravellrFeed, WorldNomadsFeed, TwitterFeed, FlickrFeed, WikiTravelFeed];
    var feeds = [TravellrFeed, TwitterFeed];
    feeds.each(function(AFeedClass) {
        new AFeedClass(searchBox, container);
    });
    
});
