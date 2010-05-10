var DisplayBox = new Class({
        
        Implements: Options,

	mouseX : null,
	mouseY : null,

        feedItem: null,

        options: {
            readMore: true
        },
	
	initialize: function(feedItem, options) {
	
		this.feedItem = feedItem;
                this.feedItem.setDisplayBox(this);

                this.setOptions(options);
		
	},

	getPreview: function() {
            if (!this.preview) {
		
                var preview = this.feedItem.getPreview();
                preview.addClass('displayBox');

                if (this.options.readMore) {
                    var readMore = new Element('a', {text: 'Read more...', href: this.feedItem.url || '#'});
                    preview.grab(readMore);
                    readMore.addEvent('click', (function(event) {
                        event.stop();
                        this.showContent();
                    }).bind(this));
                }

                this.preview = preview;
            }
            return this.preview;
	
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

            $(document.body).grab(modalMask);
            $(document.body).grab(modal);

            var preview = this.getPreview();
            boxLocation = preview.getPosition();
            boxSize = preview.getSize();
            modalSize = modal.getSize();

            modal.setPosition({
                x: boxLocation.x + ((boxSize.x - modalSize.x) / 2),
                y: boxLocation.y + ((boxSize.y - modalSize.y) / 2)
            })

            modalMask.fade('hide');
            modalMask.fade('0.1');
            modal.fade('hide');
            modal.fade('in');

            content.grab(modalClose);
            modal.grab(content);

            var close = function() {
                modal.removeChild(content);
                modal.destroy();
                modalMask.destroy();
                modalClose.destroy();
            };

            modalClose.addEvent('click', close);
            modalMask.addEvent('click', close);
            

	},
	
	makePreviewContainer: function(element){
	
	
	},
	
	makeContentContainer: function(element){
	
	
	}
	
	
});