/*
Class: world-nomads.WorldNomadsFeed
    Retrieves World Nomads blog posts from the World Nomads Yahoo Pipe

Extends:
   <Feed>

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - <MooTools::core> 1.2.4 or higher
   - <MooTools::more> 1.2.4.4 RC1 or higher
   - <Feed>
   - <world-nomads.WorldNomadsFeedItem>
*/

var WorldNomadsFeed = new Class({

    Extends: Feed,

    /**
     * Variable: perPage
     * The maximum number of posts displayed
     */
    perPage: 10,

    /**
     * Variable: page
     * The page number of the current search. Incremented every search
     */
    page: 1,

    /**
    * Variable: name
    * The name of thie <Feed>, used in the GUI
    */
    name: 'WorldNomads',

    /**
    * Function: search
    * Search the feed for items relating to the search terms. This particular
    * search is actually done to yahoo pipes in which the pipe handles the request
    * and converts a RSS feed from World Nomads into a JSON object. It then
    * calls makeFeedItems on success.
    *
    * Parameters:
    *     searchFilter - The search filter to filter results with
    */
    newSearch: function(searchFilter) {
        this.parent();
        this.searchFilter = searchFilter;
    },

    getMoreFeedItems: function() {
        var country = (this.searchFilter.location && this.searchFilter.location.country ? this.searchFilter.location.country.toLowerCase() : null);
        var country_id = this.countries.get(country);
        
        //if the search string doesn't return a country, don't request World Nomads feed and grey out the toggle
        if (!$chk(country_id) || (!this.searchFilter.location.name.toLowerCase().contains(country))) {
            $$('.WorldNomadsfeed_toggle').addClass('unavailable');
			this.moreFeedItems = false;
            this.feedItemsReady();
            return;
        }
		$$('.WorldNomadsfeed_toggle').removeClass('unavailable');

        new Request.JSONP({
            url: 'http://pipes.yahoo.com/pipes/pipe.run',
            data: {
                _id: 'cb5de2b4f3316941e39cd06ca852e7a9',
                _render: 'json',
                country_id: country_id
            },
            callbackKey: '_callback',
            onSuccess: this.makeFeedItems.bind(this)
        }).send();
    },

    /**
    * Function: makeFeedItems
    * Makes the individual <WorldNomadsFeedItems> from the search results.
    * <feedItemsReady> is called when everything is created, to populate the <Container>
    *
    * Parameters:
    *     response - object returned by the yahoo pipes call (parsing world nomads feeds)
    */
    makeFeedItems: function(results) {
	
        if (results && results.value && results.value.items && $chk(results.value.items.length)) {
            results.value.items.each(function(post) {
                this.feedItems.push(new WorldNomadsFeedItem(post));
            }, this);
        }

        this.moreFeedItems = false;
        this.feedItemsReady();
    },

    /**
    * Variable: countries
    * An array of country IDs. Searches need to be made using the country ID,
    * not the name, so this array can map between the two.
    */
    countries: $H({
        'argentina': 11,
        'australia': 14,
        'austria': 15,
        'bolivia': 27,
        'botswana': 29,
        'brazil': 31,
        'cambodia': 37,
        'canada': 39,
        'chile': 44,
        'china': 45,
        'colombia': 48,
        'costa rica': 53,
        'croatia': 55,
        'cuba': 56,
        'ecuador': 63,
        'egypt': 64,
        'fiji': 72,
        'france': 74,
        'germany': 81,
        'greece': 84,
        'guatemala': 89,
        'hungary': 97,
        'india': 99,
        'indonesia': 100,
        'ireland': 103,
        'italy': 105,
        'japan': 107,
        'kenya': 110,
        'laos': 116,
        'malaysia': 129,
        'mexico': 138,
        'morocco': 144,
        'myanmar': 146,
        'nepal': 149,
        'netherlands': 150,
        'new zealand': 153,
        'norway': 160,
        'pakistan': 162,
        'panama': 165,
        'peru': 168,
        'philippines': 169,
        'poland': 171,
        'portugal': 172,
        'south africa': 197,
        'south korea': 113,
        'spain': 199,
        'sri lanka': 200,
        'sweden': 205,
        'switzerland': 206,
        'syria': 207,
        'thailand': 211,
        'turkey': 218,
        'united kingdom': 225,
        'usa': 227,
        'venezuela': 232,
        'vietnam': 233
    })
});
