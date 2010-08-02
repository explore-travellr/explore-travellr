/*
Script: TravellrFeedItem.js
   TravellrFeedItem - MooTools based Travellr feed item handler

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - MooTools-core 1.2.4 or higher
   - MooTools-more 1.2.4.4 RC1 or higher
   - FeedItem Class
   - TravellrFeed Class
*/

var TravellrFeedItem = new Class({

    Extends: FeedItem,

    question: null,

    name: 'TravellrFeedItem',

    /**
     * Sets the parameter to a instance variable then sets the safe subject and
     * question url
     *
     * @param feedObject The object is associative array of keys related
     * to the feedObject passed in
     */
    initialize: function(feedObject) {
        
        this.question = feedObject;
        this.question.safe_subject = this.question.subject.toLowerCase().replace(/[^a-z0-9]*/, '-').replace(/^-|-$/, '');
        this.question.url = 'http://travellr.com/questions/place/' + this.question.id + '/' + this.question.safe_subject;

        this.size = {x: 2};
    },

    /**
     * Builds a feed item preview to go in the displayBox within the container
     *
     * @example <div class="displayBox">
     *              <div class="travellr inner">
     *                  <p></p>
     *              </div>
     *          </div>
     */
    makePreview: function() {
        return new Element('div', {
            'class': 'travellr'
        }).adopt([
            new Element('p', {
                text: this.question.subject.truncateText(100)//this.truncateText(this.question.subject)
            }),
        ]);
    },

    /**
     * Builds a feed item content div for insertion into the modal box once
     * clicked
     *
     * @example <div class="modal">
     *              <div class="content">
     *                  <div class="travellr">
     *                      <h2>
     *                          <a href=""></a>
     *                      </h2>
     *                      <p></p>
     *                      <p class="date"></p>
     *                  </div>
     *              </div>
     *         </div>
     */
    makeContent: function() {
        var answers = [
            new Element('h3', {text: 'Answers'}),
        ];
        this.question.answers.each(function(answer) {
            answers.push(new Element('div', {'class': 'answer'}).adopt([
                new Element('p', {'class': 'asside', text: 'A:'}),
                new Element('p', {text: answer.content})
            ]));
        });

        return new Element('div', {
            'class': 'travellr'
        }).adopt([
            new Element('h2').grab(new Element('a', {
                text: this.question.subject,
                href: this.question.url
            })),
            new Element('p').adopt(this.question.content.newlineToBr()),
            new Element('div', {'class': 'answers'}).adopt(answers),
            new Element('p', {
                'class': 'date',
                text: Date.parse(this.question.created_at).toString()
            })
        ]);
    },

    serialize: function() {
        return this.question;
    }
});
TravellrFeedItem.unserialize = function(data) {
    return new TravellrFeedItem(data);
};

TravellrFeedItem.Ask = new Class({

    Extends: FeedItem,

    // TODO: Work out how to submit this paramater to travellr
    locationId: null,

    MAX_LENGTH: 140,
    ACTION: 'http://travellr.com/ask',

    initialize: function(locationId) {
        this.locationId = locationId;
        this.size = {x: 2};
    },

    makePreview: function() {
        return new Element('div', {
            'class': 'travellr ask'
        }).adopt([
            new Element('p', {
                text: 'Didn\'t find the information you were looking for? Ask a question on Travellr.com!'
            })
        ]);

    },

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
                ]),
            ]);
    },

    canScrapbook: function() {
        return false;
    },


});

