var FlickrFeedItem = new Class({

    Extends: FeedItem,

    data: null,

    content: null,
    preview: null,

    initialize: function(data) {
        //console.log(data);
        this.photo = data;

        //this.question.safe_subject = this.question.subject.toLowerCase().replace(/[^a-z0-9]*/, '-').replace(/^-|-$/, '');
        this.photo.url = 'http://www.flickr.com/photos/'+this.photo.owner+'/'+this.photo.id;
        this.photo.picUrl = 'http://farm'+this.photo.farm+'.static.flickr.com/'+this.photo.server+'/'+this.photo.id+'_'+this.photo.secret+'_t.jpg'
        this.size = {
            x: $random(1, 4),
            y: $random(1, 4)
        };
    },

    makePreview: function() {
       // console.log('makePreview');
        return new Element('div', {
            'class': 'flickr'
        }).adopt([
            new Element('img', {
                text: this.photo.title,
                src: this.photo.url
                }),
            ]);
    },

    //TODO fade in the photos
    makeContent: function() {
       // console.log('makeContent');
        return new Element('div', {
            'class': 'flickr'
        }).adopt([
            new Element('h2').grab(new Element('a', {
                text: this.photo.title,
                href: this.photo.url
            })),
            new Element('a', {href: this.photo.url}).grab(new Element('img', {
                src: this.photo.picUrl,
                style: 'width:100px; height: 100px; border:3px solid red'
            }))
        ]);

    },

    // inject and display photos
    injectPhoto: function() {
        this.loadCount++;

        this.set[this.loadCount] = new Element('a', {
            'href': this.photo.picUrl,
            'title': this.photo.title,
            'styles': {
                'opacity': 0
            }
        }).grab(this.photo).inject('flickr').fade('in');

        if(this.loadCount == 1) this.fireEvent('complete', this.set);
    }

});
