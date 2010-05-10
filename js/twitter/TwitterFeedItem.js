var TwitterFeedItem = new Class({

    Extends: FeedItem,

    data: null,

    content: null,
    preview: null,

    initialize: function(data) {
        this.text = data;

        this.text = this.text.toLowerCase().replace(/[^a-z0-9]*/, '-').replace(/^-|-$/, '');
        this.text.url = 'http://search.twitter.com/.json?q=' + this.text.q;

        this.size = {
            x: $random(1, 4),
            y: $random(1, 4)
        };
    },

    makePreview: function() {
        return new Element('div', {
            'class': 'twitter'
        }).adopt([
            new Element('p', {
                text: this.text.subject
            }),
            ]);
            
    },
    onComplete: (function(data) {
        console.log(data);
    /*
                data.each(function(questionData) {
                    var feedItem = new TravellrFeedItem(questionData);
                    this.feedItems.push(feedItem);
                }, this);

                this.feedReady();
                */
    }).bind(this),
    onFailure: function() {
        console.log(arguments);

            makeContent: function() {
                return new Element('div', {
                    'class': 'twitter'
                }).adopt([
                    new Element('h2').grab(new Element('a', {
                        text: this.text.from_user,
                        href: this.text.url
                    })),
                    new Element('p').adopt(this.text.content.newlineToBr()),
                    new Element('p', {
                        'class': 'date',
                        text: Date.parse(this.text.created_at).toString()
                    })
                    ]);
            }
    }
});
