var TravellrFeedItem = new Class({

    Extends: FeedItem,

    data: null,

    content: null,
    preview: null,

    initialize: function(data) {
        
        this.question = data;

        this.question.safe_subject = this.question.subject.toLowerCase().replace(/[^a-z0-9]*/, '-').replace(/^-|-$/, '');
        this.question.url = 'http://travellr.com/questions/place/' + this.question.id + '/' + this.question.safe_subject;
        this.url = this.question.url;

        this.size = {
            x: $random(1, 4),
            y: $random(1, 4)
        };
    },

    makePreview: function() {
        return new Element('div', {
            'class': 'travellr'
        }).grab(new Element('div', {'class': 'inner'}).adopt([
            new Element('p', {
                text: this.question.subject
            }),
        ]));
    },

    makeContent: function() {
        return new Element('div', {
            'class': 'travellr'
        }).adopt([
            new Element('h2').grab(new Element('a', {
                text: this.question.subject,
                href: this.question.url
            })),
            new Element('p').adopt(this.question.content.newlineToBr()),
            new Element('p', {
                'class': 'date',
                text: Date.parse(this.question.created_at).toString()
                })
            ]);
    }

});
