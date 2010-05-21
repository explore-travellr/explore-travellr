/*
Script: Container.js
   Container - DESC TODO
   FeedToggle - DESC TODO

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - MooTools-core 1.2.4 or higher
   - MooTools-more 1.2.4.4 RC1 or higher
*/

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
   		this.masonry = this.container.masonry({ columnWidth: 100, itemSelector: '.displayBox' });

        this.addDisplayBoxFromQueue = this.addDisplayBoxFromQueue.bind(this);
    },

    addFeed: function(feed) {
        this.feeds.push(feed);
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
        this.container.masonry({appendContent: [preview]});

        displayBox.setContainer(this);
        this.displayBoxes.push(displayBox);

        if (this.displayBoxQueue.length !== 0) {
            this.queueTimer = this.addDisplayBoxFromQueue.delay(this.queueDelay);
        } else {
            this.queueTimer = null;
        }
    },

    // Possiblly irrelivant
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

var FeedToggle = new Class({

    data: null,

    container: null,

    initialize: function(container) {
        this.container = $(container);
    },

    addFeed: function(feed) {
        var button = new Element('a', {
            'href' : '',
            'text': feed.name + ' on/off',
            'class': feed.name+' button'
        });

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

        this.container.grab(button);
    }
});
