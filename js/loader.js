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

			console.log(html);
			return html;
		}
});

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
