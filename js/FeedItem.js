var FeedItem = new Class({

    Implements: [Options, Events],

    content: null,
    preview: null,
    title: 'Empty element',
    url: 'http://example.com/',
    date: new Date(),
    displayBox: null,

    initialize: function(options) {
        this.options = options;
    },
    getPreview: function() {
        return this.preview || this.makePreview();
    },
    getContent: function() {
        return this.content || this.makeContent();
    },
    setDisplayBox: function(DisplayBox) {
        return 0;
    },
    getDisplayBox: function() {
        return 0;
    }
});