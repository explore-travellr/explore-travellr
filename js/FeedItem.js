var FeedItem = new Class({

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
});
