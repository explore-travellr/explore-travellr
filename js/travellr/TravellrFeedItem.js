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

TravellrFeedItem.Ask = new Class({
	Extends: FeedItem,

	// TODO: Work out how to submit this paramater to travellr
	locationId: null,

	MAX_LENGTH: 140,
	ACTION: 'http://travellr.com/ask',
	LINK: 'http://travellr.com/',

	form: null,
	textarea: null,

	initialize: function(locationId) {
		this.locationId = locationId;
		this.displayed = this.displayed.bind(this);

		this.form = new Element('form', {method: 'get', action: this.ACTION, target: '_blank'});
		this.textarea = new Element('textarea', {name: 'q', rows: 2});
	},

	makePreview: function() {
		return new Element('div', {'class': 'travellr ask'}).adopt([
			new Element('p', {text: 'Didnt find the information you were looking for? Ask a question on Travellr.com!'})
		]);
	},

	makeContent: function() {
		var submit = new Element('input', {type: 'submit', value: 'ask'}),
			maxLength = this.MAX_LENGTH,
			counter = new Element('span', {'class': 'length', text: maxLength}),
			link = new Element('a', {text: 'Provided by travellr.com', href: this.LINK}),
			textarea = this.textarea;

		textarea.addEvent('keyup', function() {
			var isError = this.form.hasClass('error'),
				charsLeft = maxLength - textarea.get('value').length,
				tooLong = charsLeft < 0;

			if (tooLong && !isError) {
				this.form.addClass('error');
			} else if (!tooLong && isError) {
				this.form.removeClass('error');
			}

			counter.set('text', charsLeft);

		});

		return new Element('div', {'class': 'travellr ask'}).adopt([
			new Element('h2', {text: 'Ask your travel question on Travellr.com'}),
			this.form.adopt([
			    textarea,
				submit,
				counter,
				link
			]),
		]);
	},

	displayed: function() {
		var textarea = this.textarea;
		(function() {
			textarea.focus();
		}).delay(100);
	},

	setDisplayBox: function(displayBox) {
		if (this.displayBox) {
			this.displayBox.removeEvent('display', this.displayed);
		}
		this.parent(displayBox);
		if (this.displayBox) {
			this.displayBox.addEvent('display', this.displayed);
		}
	}

});
