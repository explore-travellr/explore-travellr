/*
Class: travellr.TravellrFeedItem
    Displays content obtained by a <TravellrFeed>

Extends:
    <FeedItem>

License:
    MIT-style license.

Copyright:
    Copyright (c) 2010 explore.travellr.com

Dependencies:
    - <MooTools::core> 1.2.4 or higher
    - <MooTools::more> 1.2.4.4 RC1 or higher
    - <TravellrFeed>
*/

var TravellrFeedItem = new Class({

    Extends: FeedItem,
    Serializable: 'TravellrFeedItem',

    /**
     * Variable: name
     * The name of this <FeedItem>, used in the GUI
     */
    name: 'TravellrFeedItem',
	
    /**
     * Variable: question
     * A <JS::Object> holding all the question data
     *
     * See Also:
     *     - <http://api.travellr.com/explore_travellr>
     */
    question: null,

	
    /**
     * Variable: MAX_ANSWERS
     * Maximum answers allowed to be show on content
     */	
	MAX_ANSWERS: 3,
	
    /**
     * Variable: answerCount
     * Number of answers attached to the question
     */	
	answerCount: null,	
	
    /**
     * Consructor: initialize
     * Sets the parameter to a instance variable then sets the safe subject and
     * question url
     *
     * Parameters:
     *     feedObject - The object is associative array of keys related to the feedObject passed in
     */
    initialize: function(feedObject) {
        
        this.question = feedObject;
		this.answerCount = this.question.answer_count;
        this.question.safe_subject = this.question.subject.toLowerCase().replace(/[^a-z0-9]*/, '-').replace(/^-|-$/, '');
        this.question.url = 'http://travellr.com/questions/place/' + this.question.id + '/' + this.question.safe_subject;

        this.size = {x: 2};
    },

    /**
     * Function: makePreview
     * Builds a <MooTools::Element> containing a preview of this <TravellrFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> containing a preview of this <TravellrFeedItem>
     */
    makePreview: function() {
        return new Element('div', {
            'class': 'travellr',
			title: 'Click to view some answers to this question'
        }).adopt([
            new Element('p', {
                text: this.question.subject.truncateText(100)
            })
        ]);
    },

    /**
     * Function: makeContent
     * Builds a <MooTools::Element> with the content of this <TravellrFeedItem>
     *
     * Returns:
     *     A <MooTools::Element> with the content of this <TravellrFeedItem>
     */
    makeContent: function() {
        this.url = this.question.url;
        var answers = [
            new Element('h3', {text: 'Answers'})
        ];

		var i, l = Math.min(3, this.answerCount);
		for(i = 0; i < l; ++i) {
			answers.push(new Element('div', {'class': 'answer'}).adopt([
				new Element('p', {text: this.question.answers[i].content})
			]));
        }

        return new Element('div', {
            'class': 'travellr'
        }).adopt([
            new Element('h2').grab(new Element('a', {
                text: this.question.subject,
                href: this.question.url,
				target: '_blank',
				title: 'Click to go to the source on travellr.com'
            })),
            new Element('p').adopt(this.question.content.newlineToBr()),
            new Element('div', {'class': 'answers'}).adopt(answers),
            new Element('a', {
                'class': 'view-more',
                href: this.question.url, 
                text: 'View more answers'
            })
        ]);
    },

    /**
     * Function: clone
     * Returns a clone of this instance
     *
     * Returns:
     * A clone of this TravellrFeedItem
     */
    clone: function() {
        return new TravellrFeedItem(this.question);
    },

    /**
     * Function: serialize
     * Returns the question data, ready for serialization
     *
     * Returns:
     *     The question data
     */
    serialize: function() {
        return this.question;
    }
});

/*
Function: unserialize
Unserializes a TravellrFeedItem from serialized data

Parameters:
	data - The serialized data

Returns:
A new TravellrFeedItem, identical to the serialized one
*/
TravellrFeedItem.unserialize = function(data) {
    return new TravellrFeedItem(data);
};

/**
 * Class: travellr.TravellrFeedItem.Ask
 * A <FeedItem> that allows users to ask a question directly to Travellr
 * 
 * Extends:
 * <FeedItem>
 * 
 * License:
 * MIT-style license.
 * 
 * Copyright:
 * Copyright (c) 2010 explore.travellr.com
 * 
 * Dependencies:
 *     - <MooTools::core> 1.2.4 or higher
 *     - <MooTools::more> 1.2.4.4 RC1 or higher
 *     - <TravellrFeed>
*/
TravellrFeedItem.Ask = new Class({

    Extends: FeedItem,

    /**
     * Variable: locationId
     * The location this question is about. Optional
     */
    locationId: null,

    /**
     * Variable: name
     * The name of this <FeedItem>, used in the GUI
     */
    name: 'TravellrFeedItem.Ask',    

    /**
     * Constant: MAX_LENGTH
     * The maximum length of a question on Travellr
     */
    MAX_LENGTH: 140,

    /**
     * Constant: ACTION
     * The URL to post to question to
     */
    ACTION: 'http://travellr.com/ask',

    /**
     * Constructor: initialize
     * Create a new <Ask> box
     *
     * Parameters:
     *     locationId - The location this question is about. Optional
     */
    initialize: function(locationId) {
        this.locationId = locationId;
        this.size = {x: 2};
    },

    /**
     * Function: makePreview
     * Builds a <MooTools::Element> containing some explanatory text
     *
     * Returns:
     *     A <MooTools::Element> containing some explanatory text
     */
    makePreview: function() {
        return new Element('div', {
            'class': 'travellr ask'
        }).adopt([
            new Element('p', {
                text: 'Didn\'t find the information you were looking for?'
            })
        ]).adopt([
            new Element('p', {
                text: 'Ask a question on Travellr.com!'
            })
        ]);

    },

    /**
     * Function: makePreview
     * Builds a <MooTools::Element> containing a form and text field, to submit
     * a question to Travellr
     *
     * Returns:
     *     A <MooTools::Element> containing a form and text field
     */
    makeContent: function() {
        var textarea = new Element('textarea', {
            name: 'q',
            rows: 2
        }),
        submit = new Element('input', {
            type: 'submit',
            value: 'ask'
        }),
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

        return new Element('div', {
            'class': 'travellr ask'
        }).adopt([
            new Element('h2', {
                text: 'Ask your travel question on Travellr.com'
            }),
            new Element('form', {
                method: 'get',
                action: this.ACTION,
                target: '_blank'
            }).adopt([
                textarea,
                submit
                ])
            ]);
    },
	
    /**
     * Function: canScrapbook
     * Simply a unified function for feeditems that check if the item can be 
	 * placed into favourites
     *
     * Returns:
     *     False, the ask box can not be added to favourites
     */
    canScrapbook: function() {
        return false;
    }
});
