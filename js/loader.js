window.addEvent('domready', function() {
	var searchBox, container, feeds;
	searchBox = new SearchBox($('#searchField'));
	container = new Container($('#container'));

	//feeds = [TravellrFeed, WorldNomadsFeed, TwitterFeed, FlickrFeed WikiTravelFeed];
	feeds = [TravellrFeed];

	feeds.each(function(XFeed) {
		var feed = new XFeed(searchBox, container);
	});
});
