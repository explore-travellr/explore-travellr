var DisplayBox = new Class({

    Implements: Options,

    mouseX : null,
    mouseY : null,

    feedItem: null,

    options: {
        readMore: true
    },

    margin: 50,

    container: null,

    initialize: function(feedItem, options) {
        this.feedItem = feedItem;
        this.feedItem.setDisplayBox(this);
        this.setOptions(options);
    },

    //Creates the preview box (CSS class: displayBox)
    getPreview: function() {
        if (!this.preview) {

            var preview = this.feedItem.getPreview();

            preview.addClass('displayBox');

            if (this.feedItem.hasContent()) {
                preview.addEvent('click', (function(event) {
                    event.stop();
                    this.showContent();
                }).bind(this));
                preview.addEvent('mouseover', (function() {
                    this.changeBorder();
                }).bind(this));
                preview.addEvent('mouseout', (function() {
                    this.revertBorder();
                }).bind(this));
            }

            this.preview = preview;
        }
        return this.preview;

    },
    changeBorder: function() {
      var preview = this.getPreview();
      preview.setStyles({
          'border-width': '4px',
          width: 168,
          height: 148,
          'padding': '8px',
          'background-position':'3px 3px'
         // 'padding-right': '10px'
      });

    },

    revertBorder: function() {
        var preview = this.getPreview();
      preview.setStyles({
          'border-width': '2px',
          width: 168,
          height: 148,
          'padding': '10px',
          'background-position':'5px 5px'
      });
    },
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

    }

});
