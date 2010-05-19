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

Array.implement({
	getRandomKey: function() {
		return $random(0, this.length - 1);
	},
	removeRandom: function() {
		var index = this.getRandomKey();
		    splice = this.splice(index, 1);
		return splice[0];
	}
});

window.addEvent('domready', function() {

    var searchBox = new SearchBox('searchField');
    var container = new Container('container', searchBox);

    //feeds = [TravellrFeed, WorldNomadsFeed, TwitterFeed, FlickrFeed, WikiTravelFeed];
    var feeds = [TravellrFeed, TwitterFeed, FlickrFeed, WorldNomadsFeed];
    feeds.each(function(AFeedClass) {
        new AFeedClass(searchBox, container);
    });
    
    var searchString = location.href.toURI().getData('search').replace(/\+/g, ' ');
    if (searchString) {
        $('searchField').set('value', searchString);
        searchBox.search(searchString);
    }
        
});
