var Container = new Class({

    container: null,
    displayBoxes: [],
    feeds: [],

    toggleBox: null,
    
    initialize: function(containerId){
        this.container = $(containerId);

        this.toggleBox = new FeedToggleBox();
        this.addDisplayBox(new DisplayBox(this.toggleBox, {readMore: false}));
    },
	
    addFeed: function(feed) {
        this.feeds.push(feed);
        this.toggleBox.addFeed(feed);
    },
	
    addDisplayBox: function(displayBox) {
	
        this.container.grab(displayBox.getPreview());
        this.displayBoxes.push(displayBox);

    },
    
    getDisplayBoxes: function(feed) {
    
        return displayBoxes;
    },
    
    removeDisplayBox: function(displayBox) {

        this.displayBoxes.erase(displayBox);
        this.container.removeChild(displayBox.getPreview());
        
    },
    
    layout: function() {}
    
});
var FeedToggleBox = new Class({

    Extends: FeedItem,

    data: null,

    content: null,
    preview: null,

    initialize: function() {},

    addFeed: function(feed) {
        var preview = this.getPreview();

        var button = new Element('input', {'type': 'button', 'value': feed.name + ' on/off'});
        button.addEvent('click', function() {
            feed.setVisible(!feed.isVisible());
        });

        preview.grab(button);
    },

    makePreview: function() {
        return new Element('div', {'class': 'feedToggle'}).adopt([
            new Element('h2', {text: 'Toggle feeds'}),
        ]);
    },

    makeContent: function() {
    }

});
