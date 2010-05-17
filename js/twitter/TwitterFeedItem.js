var TwitterFeedItem = new Class({

    Extends: FeedItem,

    data: null,

    content: null,
    preview: null,

    name: 'Twitter',

    initialize: function(data) {
        this.text = data;

        this.text.url = 'http://twitter.com/' + this.text.from_user + '/status/' + this.text.id;

        this.size = {
            x: $random(1, 4),
            y: $random(1, 4)
        };
    },

    makePreview: function() {
		var text = this.text.text
		var length = text.length;
		var max_length = 100;
		if(length >= max_length){
			var text = text.substring(0, 100);
			var text = text + '...';
		};
        return new Element('div', {
            'class': 'twitter'
        }).grab(new Element('div', {'class': 'inner'}).adopt([
            new Element('p', {
                text: text
            }),
        ]));
    },

    makeContent: function() {
        return new Element('div', {
            'class': 'twitter'
        }).adopt([
            new Element('h2').grab(new Element('a', {
                text: this.text.from_user,
                href: this.text.url
            })),
            new Element('p', {text: this.text.text}),
            new Element('p', {
                'class': 'date',
                text: Date.parse(this.text.created_at).toString()
            })
        ]);
    }
});
