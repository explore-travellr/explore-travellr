/*
Class: DisplayBox
    Displays a small preview of a <FeedItem> in a <Container>, and the large view
    of the <FeedItem> in a lightbox style popup

License:
    MIT-style license.

Copyright:
    Copyright (c) 2010 explore.travellr.com

Dependencies:
   - <MooTools::core> 1.2.4 or higher
   - <MooTools::more> 1.2.4.4 RC1 or higher
   - <MooTools::Request.JSONP>
   - <FeedItem>

See Also:
   - <Container>
   - <FeedItem>
*/

var DisplayBox = new Class({

    Implements: [Events, Options],

    /**
     * Variable: feedItem
     * The <FeedItem> this <DisplayBox> is handling
     */
    feedItem: null,

    /**
     * Variable: options
     * Options for this <DisplayBox> instance
     *
     *     readMore - Whether the <FeedItem> has more content to show
     */
    options: {
        readMore: true,
        scrapbook: null
    },

    /**
     * Variable: container
     * The <Container> that this <DisplayBox> is managed by
     */
    container: null,

    /**
     * Variable: shown
     * If the content is currently shown
     */
    shown: false,

    /**
     * Function: initialize
     * Create a new <DisplayBox> for a <FeedItem>.
     *
     * Parameters:
     *     feedItem - The <FeedItem> to manage 
     *     options - Options for this class
     */
    initialize: function(feedItem, scrapbook, options) {
        this.feedItem = feedItem;
        this.scrapbook = scrapbook;
        this.feedItem.setDisplayBox(this);
        this.setOptions(options);
    },

    /**
     * Function: getPreview
     * Get an <MooTools::Element> containing a preview of the <FeedItem>.
     *
     * Returns:
     *     A preview of the FeedItem
     */
    getPreview: function() {
        if (!this.preview) {

            var size = this.feedItem.getSize();

            var preview = this.feedItem.getPreview();
            preview.addClass('inner');
            preview.setStyles({position: 'relative'});

            var wrapper = new Element('div');
            wrapper.adopt([preview]);
            wrapper.addClass('displayBox');
            wrapper.setStyles({
                width: size.x * 100
            });


            if (this.getFeedItem().canScrapbook() && this.scrapbook) {
                var handle = new Element('div', {'class': 'handle',title:'Click and hold to drag to favourites'});
                handle.addEvent('click', function(event) { event.stop(); });
                preview.grab(handle);

                this.scrapbook.addDraggable(preview, {handle: handle});
            }

            preview.addEvent('click', (function(event) {
                event.stop();
                this.showContent();
            }).bind(this));

            this.preview = wrapper;
        }
        return this.preview;

    },

    /**
     * Function: getContent
     * Get an HTML element containing the content of the FeedItem
     *
     * Returns:
     *     The FeedItem content
     */
    getContent: function() {
        if (!this.content) {
            var content = this.feedItem.getContent();
            this.content = content;
        }
        return this.content;
    },

    /**
     * Function: getContainer
     * Get the <Container> that this <DisplayBox> is managed by
     *
     * Returns:
     *     The <Container> this <DisplayBox> is managed by, or null
     */
    getContainer: function() {
        return this.container;
    },

    /**
     * Function: getFeedItem
     * Get the <FeedItem> that this <DisplayBox> is displaying
     *
     * Returns:
     *     The <FeedItem> this <DisplayBox> is displaying
     */
    getFeedItem: function() {
        return this.feedItem;
    },

    /**
     * Function: setContainer
     * Sets the <Container> that this <DisplayBox> is managed by
     */
    setContainer: function(container) {
        this.container = container;
    },

    /**
     * Function: showContent
     * Show the full content of the <FeedItem> in a modal dialog.
     */
    showContent: function() {

        if (this.shown) {
            alert("Attempted to show twice");
            return;
        }
        this.shown = true;

        var content = this.feedItem.getContent();
        var iconBar = new Element('div', { 'class': 'icons' });

        // Put all the element in their correct containers
        var askForButtons = [this.feedItem];
        if (this.scrapbook) {
            askForButtons.unshift(this.scrapbook);
        }
        var options = {
            feedItem: this.feedItem,
            scrapbook: this.scrapbook,
            displayBox: this
        };

        var buttons = [];
        askForButtons.each(function(ask) {
            buttons.include(ask.getDisplayBoxButtons(options));
        });
        
        buttons.each(function(button) {
            iconBar.adopt(button);
            iconBar.adopt(button);
        });

        var contentWrapper = new Element('div', { 'class': 'content' });
        contentWrapper.adopt([content, iconBar]);

        var modal = new MooDialog({
            size: {width: null, height: null},
            useEscKey: true,

            // Tell listeners that this box was just displayed
            onOpen: (function() {
                this.fireEvent('display');
            }).bind(this),
            onClose: (function() {
                this.shown = false;	
            }).bind(this)
        }).setContent(contentWrapper).open();
    }
});
