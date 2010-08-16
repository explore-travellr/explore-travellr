/*
Class: lonely-planet.LonelyPlanetFeedItem
    Displays Lonely Planet photos retrieved by a <LonelyPlanetFeed>

Extends:
    <FeedItem>

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - <MooTools::core> 1.2.4 or higher
   - <MooTools::more> 1.2.4.4 RC1 or higher
   - <LonelyPlanetFeed>
*/

var LonelyPlanetFeedItem = new Class({

    Extends: FeedItem,
    Serializable: 'LonelyPlanetFeedItem',

    /**
     * TODO
     */
    feedObject: null,

    /**
     * TODO
     */
    name: 'LonelyPlanetFeedItem',

    /**
     * TODO
     */
    initialize: function(feedObject) {
        this.feedObject = feedObject;
    },

    /**
     * TODO
     */
    makePreview: function() {
    },

    /**
     * TODO
     */
    makeContent: function() {
    },

    /**
     * TODO
     */
    serialize: function() {
    }

});
LonelyPlanetFeedItem.unserialize = function(data) {
    return new LonelyPlanetFeedItem(data);
};
