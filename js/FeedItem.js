var FeedItem = new Class({

    Implements: [Options, Events],
    
    type: null,
    content: null,
    preview: null,
    size: null,

    initialize: function() { },

    getContent: function() {
        if (!this.content) {
            this.content = this.makeContent();
        }
        return this.content;
    },

    getPreview:function() {
        if (!this.preview) {
            this.preview = this.makePreview();
        }
        return this.preview;
    },

    getSize: function() {
        return this.size();
    },
    setDisplayBox: function(displayBox) {
        this.displayBox = displayBox;
    },
    getDisplayBox: function() {
        return this.displayBox;
    },

    hasPreview: function() {
        return true;
    },

    hasContent: function() {
        return true;
    },

    truncateText: function(strText){
        if(strText.length >= 100){
            return strText.substring(0, 100) + ' ...';
        }
        else{
            return strText;
        }
    }
});
