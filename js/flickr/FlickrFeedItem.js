var FlickrFeedItem = new Class({

    Extends: FeedItem,

    data: null,

    content: null,
    preview: null,

    initialize: function(data) {
        this.photo = data;

        this.photo.url = 'http://www.flickr.com/photos/'+this.photo.owner+'/'+this.photo.id;
        this.photo.picUrlThumbnail = 'http://farm'+this.photo.farm+'.static.flickr.com/'+this.photo.server+'/'+this.photo.id+'_'+this.photo.secret+'_m.jpg';
        this.photo.picUrlContent = 'http://farm'+this.photo.farm+'.static.flickr.com/'+this.photo.server+'/'+this.photo.id+'_'+this.photo.secret+'.jpg';

        new Asset.images([this.photo.picUrlThumbnail, this.photo.picUrlContent]);

        this.size = {
            x: $random(1, 4),
            y: $random(1, 4)
        };
    },

    makePreview: function() {
        return new Element('div', {
            'class': 'flickr'
        }).grab(new Element('div', {'class': 'inner'}).adopt([
            new Element('img', {
                text: this.photo.title,
                src: this.photo.picUrlThumbnail,
            }),
        ]));
    },

    makeContent: function() {
        return new Element('div', {'class': 'flickr'}).adopt([
            new Element('h2').grab(new Element('a', {
                text: this.photo.title,
                href: this.photo.url
            })),
            new Element('a', {href: this.photo.url}).grab(new Element('img', {
                src: this.photo.picUrlContent
            }))
        ]);
    }
});
