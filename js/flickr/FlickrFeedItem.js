var FlickrFeedItem = new Class({

    Extends: FeedItem,

    data: null,

    content: null,
    preview: null,

    initialize: function(data) {
       // console.log(data);
        this.photos = data;

        //this.question.safe_subject = this.question.subject.toLowerCase().replace(/[^a-z0-9]*/, '-').replace(/^-|-$/, '');
        this.photos.url = 'http://www.flickr.com/photos/'+this.photos.owner+'/'+this.photos.id;
        this.photos.picUrl = 'http://farm'+this.photos.farm+'.static.flickr.com/'+this.photos.server+'/'+this.photos.id+'_'+this.photos.secret+'.jpg'
        this.size = {
            x: $random(1, 4),
            y: $random(1, 4)
        };
    },

    makePreview: function() {
        //console.log("total number is: ");
        return new Element('div', {
            'class': 'flickr'
        }).adopt([
            new Element('img', {
                text: this.photos.title,
                src: this.photos.url
                }),
            ]);
    },

    makeContent: function() {
        //console.log("dafda");
        return new Element('div', {
            'class': 'flickr'
        }).adopt([
            new Element('h2').grab(new Element('a', {
                text: this.photos.title,
                href: this.photos.url
                })),
            new Element('img', {src: this.photos.picUrl, style: 'width:200px; height: 200px; border:3px solid red'}
    )]);

    }

});
