var DisplayBox = new Class({

    Implements: [Events, Options],

    mouseX : null,
    mouseY : null,

    feedItem: null,

    options: {
        readMore: true,
        scrapbook: null
    },

    margin: 50,

    container: null,

    /**
     * Create a new DisplayBox for a FeedItem.
     *
     * @param feedItem {FeedItem} The FeedItem to manage 
     * @param opeions {Object} Options for this class
     */
    initialize: function(feedItem, scrapbook, options) {
        this.feedItem = feedItem;
        this.scrapbook = scrapbook;
        this.feedItem.setDisplayBox(this);
        this.setOptions(options);
    },

    /**
     * Get an HTML element containing a preview of the FeedItem
     *
     * @return A preview of the FeedItem
     * @type Element
     */
    getPreview: function() {
        if (!this.preview) {

            var preview = this.feedItem.getPreview().addClass('inner');
            var wrapper = new Element('div').adopt([preview]);
            var size = this.feedItem.getSize();
            preview.setStyles({position: 'relative'});

            if (this.getFeedItem().canScrapbook() && this.scrapbook) {
                var handle = new Element('div', {'class': 'handle'});
                wrapper.grab(handle);

                new Drag.Move(wrapper, {
                    droppables: this.scrapbook.getButton(),
                    handle: handle,
                    onDrop: (function(draggable, droppable) {
                        if(droppable) {
                            this.scrapbook.addItem(this.getFeedItem());
                        }
                    }).bindWithEvent(this)
                });
            }

            wrapper.setStyles({
            	width: size.x * 100
            });

            wrapper.addClass('displayBox');

            preview.addEvent('click', (function(event) {
                event.stop();
                this.showContent();
            }).bind(this));

            this.preview = wrapper;
        }
        return this.preview;

    },

    /**
     * Get an HTML element containing the content of the FeedItem
     *
     * @return The FeedItem content
     * @type Element
     */
    getContent: function(){
        if (!this.content) {
            var content = this.feedItem.getContent();
            this.content = content;
        }
        return this.content;
    },

    getContainer: function(){
        return this.container;
    },

    getFeedItem: function(){
        return this.feedItem;
    },

    setContainer: function(container){
        this.container = container;
    },

    /**
     * Show the full content of the FeedItem in a Modal dialog.
     */
    showContent: function(){

        //make a modal dialog
        var modalMask = new Element('div', {'class': 'modalMask'});
        var modalClose = new Element('div', {'class': 'close-button', text:'Close'});
        var modal = new Element('div', {'class': 'modal'});
        var content = this.feedItem.getContent();
        var preview = this.getPreview();
        var container = this.container.getElement();
        var contentWrapper = new Element('div', {'class': 'content'});

        var iconBar = new Element('div', {'class': 'icons'});

        // Hide the containers
        modalMask.fade('hide');
        modal.fade('hide');

        // Put all the element in their correct containers
        if (this.getFeedItem().canScrapbook() && this.scrapbook) {
            var scrapbookAdd = new Element('div', {'class': 'scrapbook-add scrapbook-icon icon', text: 'Add to scrapbook', title: 'Add to scrapbook'});

            scrapbookAdd.addEvent('click', (function() {
                this.scrapbook.addItem(this.getFeedItem());
            }).bind(this));

            iconBar.adopt(scrapbookAdd);
        }

        contentWrapper.grab(content);

        modal.adopt([modalClose, contentWrapper, iconBar]);

        $(document.body).grab(modalMask);
        $(document.body).grab(modal);

        // Position the box
        var boxSize = preview.getSize();
        var modalSize = modal.getSize();
        var documentSize = $(document.body).getScrollSize();
        var boxLocation = preview.getPosition();

        var modalLocation = {
            x: (boxLocation.x + ((boxSize.x - modalSize.x) / 2)).limit(this.margin, documentSize.x - modalSize.x - this.margin),
            y: (boxLocation.y + ((boxSize.y - modalSize.y) / 2)).limit(this.margin, documentSize.y - modalSize.y - this.margin)
        };
        modal.setPosition(modalLocation);

        modalMask.set('styles', {height: documentSize.y});

        // Show the containers
        modalMask.fade('0.8');
        modal.fade('in');

        // Add events to elements
        $$(modalClose, modalMask).addEvent('click', function() {
            content.parentNode.removeChild(content);
            modal.destroy();
            modalMask.destroy();
            modalClose.destroy();
        });

        // Tell listeners that this box was just displayed
		this.fireEvent('display');
    }

});
