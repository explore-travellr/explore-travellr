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

    mouseX: null,
    mouseY: null,

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
    * Constant: margin
    * The minimum distance from the window edge for the modal window
    */
    margin: 50,

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
                var handle = new Element('div', {'class': 'handle'});
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

        //make a modal dialog
        var modalMask = new Element('div', { 'class': 'modalMask' });
        var modalCloseButton = new Element('div', { 'class': 'close-button', text: 'Close' });
        var modal = new Element('div', { 'class': 'modal' });
        var content = this.feedItem.getContent();
        var preview = this.getPreview();
        var container = this.container.getElement();
        var contentWrapper = new Element('div', { 'class': 'content' });

        var iconBar = new Element('div', { 'class': 'icons' });

        // Hide the containers
        modalMask.fade('hide');
        modal.fade('hide');

        // Put all the element in their correct containers
        if (this.getFeedItem().canScrapbook() && this.scrapbook) {
            var scrapbookAdd = new Element('div', { 'class': 'scrapbook-add scrapbook-icon icon', text: 'Add to scrapbook', title: 'Add to scrapbook' });
            var openNewWindow = new Element('div', { 'class': 'open-new-icon icon', text: 'Open in new window', title: 'Open in new window (not implemented)' });

            scrapbookAdd.addEvent('click', (function() {
                this.scrapbook.addItem(this.getFeedItem());
                $$('.scrapbook-add').addClass('starred');
            }).bind(this));

            iconBar.adopt(openNewWindow);
            iconBar.adopt(scrapbookAdd);
            
        }

        contentWrapper.grab(content);

        modal.adopt([modalCloseButton, contentWrapper, iconBar]);

        $(document.body).grab(modalMask);
        $(document.body).grab(modal);

        // Position the box
        var viewPos = window.getScroll();
        var viewSize = window.getSize();

        var modalSize = modal.getSize();
        var documentSize = document.getScrollSize();

        var modalLocation = {
            x: viewPos.x + (viewSize.x - modalSize.x) / 2,
            y: viewPos.y + (viewSize.y - modalSize.y) / 2
        };
        modal.setPosition(modalLocation);

        modalMask.set('styles', { height: documentSize.y });

        // Show the containers
        modalMask.fade('0.4');
        modal.fade('in');

        // Add events to elements
        $$(modalCloseButton, modalMask).addEvent('click', (function() {
			this.closeModal(modal,modalMask,modalCloseButton);
        }).bind(this));
		
		window.addEvent('keypress', (function(e){ 
			if(e.key == 'esc')
			{
				this.closeModal(modal,modalMask,modalCloseButton);
			}
		}).bind(this));
        // Tell listeners that this box was just displayed
        this.fireEvent('display');
    },
	
    /**
    * Function: closeModal
    * TODO
    */
    closeModal: function(modal,modalMask,modalCloseButton) {
		// Fix untill the double modal box bug is fixed
		if (content.parentNode) {
			content.parentNode.removeChild(content);
		}

		modal.destroy();
		modalMask.destroy();
		modalCloseButton.destroy();
		this.shown = false;	
	}	

});
