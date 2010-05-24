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
    queueDelay: 500,

    initialize: function(containerId, searchBox){
        this.container = $(containerId);
        this.masonry = this.container.masonry({ columnWidth: 100, itemSelector: '.displayBox' });

        this.addDisplayBoxFromQueue = this.addDisplayBoxFromQueue.bind(this);

        this.searchBox = searchBox;
        this.searchBox.addEvent('search', (function(event) {
            this.displayBoxQueue = [];
            // Clone the array, as we are removing elements as we go from it
            // Looping over an array as you remove elements from it leads to problems
            $A(this.displayBoxes).each(function(displayBox) {
                this.removeDisplayBox(displayBox);
            }, this);
            $clear(this.queueTimer);
        }).bind(this));
    },

    addFeed: function(feed) {
        this.feeds.push(feed);
    },

    addDisplayBox: function(displayBox) {
        this.displayBoxQueue.push(displayBox);
        this.queueAddDisplayBox();
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

        this.queueTimer = null;
        this.queueAddDisplayBox();
    },
    queueAddDisplayBox: function() {
        // Check it is not already queued
        if (!$chk(this.queueTimer)) {
            if (this.displayBoxQueue.length !== 0) {
                this.queueTimer = this.addDisplayBoxFromQueue.delay(this.queueDelay);
            } else {
                this.queueTimer = null;
            }
        }
    },

    // Possiblly irrelivant
    getDisplayBoxes: function(feed) {
        return displayBoxes;
    },

    removeDisplayBox: function(displayBox) {
        displayBox.setContainer(null);
        this.displayBoxes.erase(displayBox);
        this.displayBoxQueue.erase(displayBox);
        if (this.container.hasChild(displayBox.getPreview())) {
            this.container.removeChild(displayBox.getPreview());
        }
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
            href : '',
            text: feed.name + ' on/off',
            'class': feed.name+' button'
        });

        button.addEvent('click', function(event) {
            var isVisible = !feed.isVisible();
            event.stop();

            feed.setVisible(isVisible);

            if (isVisible) {
                button.removeClass('off');
                button.addClass('on');
            } else {
                button.removeClass('on');
                button.addClass('off');
            }

        });

        this.container.grab(button);
    }
});
