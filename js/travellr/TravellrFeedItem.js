var TravellrFeedItem = new Class({

    Extends: FeedItem,

    data: null,

    content: null,
    preview: null,

    initialize: function(data) {
        this.question = data;

        this.question.safe_subject = this.question.subject.toLowerCase().replace(/[^a-z0-9]*/, '-').replace(/^-|-$/, '');
        this.question.url = 'http://travellr.com/questions/place/' + this.question.id + '/' + this.question.safe_subject;

        this.size = {
            x: $random(1, 4),
            y: $random(1, 4)
        };
    },

    makePreview: function() {
        return new Element('div', {
            'class': 'travellr'
        }).adopt([
            new Element('p', {
                text: this.question.subject
                }),
            ]);
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

TravellrFeedItem.Ask = new Class({
	Extends: FeedItem,

	// TODO: Work out how to submit this paramater to travellr
	locationId: null,

	MAX_LENGTH: 140,
	ACTION: 'http://travellr.com/ask',

	initialize: function(locationId) {
		this.locationId = locationId;
	},

	makePreview: function() {
		return new Element('div', {'class': 'travellr ask'}).adopt([
			new Element('p', {text: 'Didnt find the information you were looking for? Ask a question on Travellr.com!'})
		]);
	},

	makeContent: function() {
		var textarea = new Element('textarea', {name: 'q', rows: 2}),
		    submit = new Element('input', {type: 'submit', value: 'ask'}),
			maxLength = this.MAX_LENGTH;

		textarea.addEvent('keyup', function() {
			var isError = textarea.hasClass('error'),
				tooLong = textarea.get('value').length >= maxLength;
			if (tooLong && !isError) {
				textarea.addClass('error');
			} else if (!tooLong && isError) {
				textarea.removeClass('error');
			}
		});

		return new Element('div', {'class': 'travellr ask'}).adopt([
			new Element('h2', {text: 'Ask your travel question on Travellr.com'}),
			new Element('form', {method: 'get', action: this.ACTION, target: '_blank'}).adopt([
				textarea,
				submit
			]),
		]);
	}

});
