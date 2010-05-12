var Container = new Class({

    container: null,
    displayBoxes: [],
    feeds: [],

    toggleBox: null,

    displayBoxQueue: [],
    queueTimer: null,
    queueDelay: 200,

    initialize: function(containerId){
        this.container = $(containerId);

        this.addDisplayBoxFromQueue = this.addDisplayBoxFromQueue.bind(this);

        this.toggleBox = new FeedToggleBox();
        this.addDisplayBox(new DisplayBox(this.toggleBox, {readMore: false}));
    },

    addFeed: function(feed) {
        this.feeds.push(feed);
        this.toggleBox.addFeed(feed);
    },

    addDisplayBox: function(displayBox) {
        this.displayBoxQueue.push(displayBox);

        if (!$chk(this.queueTimer)) {
            this.queueTimer = this.addDisplayBoxFromQueue.delay(this.queueDelay);
        }
    },
    addDisplayBoxFromQueue: function() {
        var displayBox = this.displayBoxQueue.removeRandom();
        var preview = displayBox.getPreview();

        preview.fade('hide');
        preview.fade('in');
        this.container.grab(preview);

        displayBox.setContainer(this);
        this.displayBoxes.push(displayBox);

        if (this.displayBoxQueue.length !== 0) {
            this.queueTimer = this.addDisplayBoxFromQueue.delay(this.queueDelay);
        } else {
            this.queueTimer = null;
        }
    },

    getDisplayBoxes: function(feed) {
        return displayBoxes;
    },

    removeDisplayBox: function(displayBox) {
        displayBox.setContainer(null);

        this.displayBoxes.erase(displayBox);
        this.container.removeChild(displayBox.getPreview());
    },

    getElement: function() {
        return this.container;
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

        var button = new Element('a', {'href' : '', 'text': feed.name + ' on/off', 'class': feed.name+' button'});
        button.addEvent('click', function(event) {
            var isVisible = !feed.isVisible();

            feed.setVisible(isVisible);

            if (isVisible) {
                button.removeClass('off');
                button.addClass('on');
            } else {
                button.removeClass('on');
                button.addClass('off');
            }

            event.stop();
        });

        preview.grab(button);
    },

    makePreview: function() {
        return new Element('div', {'class': 'feedToggle'}).adopt([
            new Element('b', {text: 'Feed Filter'}),
        ]);
    },

    makeContent: function() {
    },

    hasContent: $lambda(false)

});
