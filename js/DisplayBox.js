var DisplayBox = new Class({

    Implements: [Options, Events],

    mouseX : null,
    mouseY : null,

    feedItem: null,

    options: {
        readMore: true
    },

    margin: 50,

    container: null,

    /**
     * Create a new DisplayBox for a FeedItem.
     *
     * @param feedItem {FeedItem} The FeedItem to manage 
     * @param opeions {Object} Options for this class
     */
    initialize: function(feedItem, options) {
        this.feedItem = feedItem;
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
            var handle = new Element('div', {'class': 'handle'});
            var wrapper = new Element('div').adopt([preview, handle]);
            var size = this.feedItem.getSize();

            preview.setStyles({position: 'relative'});

            new Drag.Move(wrapper, {
                droppables: $('dropArea'),
                handle: handle,
                onDrop: function(draggable, droppable) {
                    if(droppable) {
                        alert('Adding to FAVOURITES! (Not Really, just disposing it)');
                        draggable.dispose();
                    }
                }
            });
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

        // Hide the containers
        modalMask.fade('hide');
        modal.fade('hide');

        // Put all the element in their correct containers
        modal.grab(modalClose);
        modal.grab(new Element('div', {'class': 'content'}). grab(content));
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

        $$(modalClose, modalMask).addEvent('click', function() {
            content.parentNode.removeChild(content);
            modal.destroy();
            modalMask.destroy();
            modalClose.destroy();
        });

		this.fireEvent('display');
    }

});
