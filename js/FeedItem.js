var FeedItem = new Class({
//testing JFK comment for git commit
          Implements: [Options, Events],

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
		}
           setDisplayBox: function(DisplayBox) {
                return 0;
           },
           getDisplayBox: function() {
                return 0;
           }
});