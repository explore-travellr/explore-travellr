/*
Class: Container
   Displays and lays out a collection of <DisplayBoxes>

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - <MooTools::core> 1.2.4 or higher
   - <MooTools::more> 1.2.4.4 RC1 or higher

See Also:
   - <DisplayBox>
     */
var Container = new Class({

    /**
    * Variable: container
    * The <MooTools::Element> that this <Container> displays its <DisplayBoxes> in
    */
    container: null,

    /**
    * Variable: displayBoxes
    * An <JS::Array> of all the <DisplayBoxes> currently displayed
    */
    displayBoxes: [],

    /**
    * Variable: feeds
    * An <JS::Array> of all the <Feeds> displayed by this <Container>
    */
    feeds: [],

    /**
    * Variable: toggleBox
    * The <FeedToggle> that controlls all the <Feeds> held in <feeds>
    */
    toggleBox: null,

    /**
    * Variable: displayBoxQueue
    * A queue (<JS::Array>) of <DisplayBoxes> that will be animated in to the
    * display
    */
    displayBoxQueue: [],

    /**
    * Variable: queueTimer
    * The timer reference for delaying the animation of <displayBoxQueue>
    */
    queueTimer: null,

    /**
    * Variable: queueDelay
    * The time in milliseconds to delay between displaying each <DisplayBox> in
    * in <displayBoxQueue>
    */
    queueDelay: 100,
    loaded: false,

    /**
    * Constructor: initialize
    * Creates a new Container class. This instance will layout its DisplayBoxes
    * in the supplied container element. The container will listen to the
    * search box, emptying itself out when a seach is made
    *
    * Paramaters:
    *     container - The element to layout the DisplayBoxes in
    *     searchBox - The SearchBox that will create searches for the feeds in this container.
    */
    initialize: function (container, searchBox) {
        this.container = $(container);
        this.masonry = this.container.masonry({
            columnWidth: 100,
            itemSelector: '.displayBox'
        });

        this.addDisplayBoxFromQueue = this.addDisplayBoxFromQueue.bind(this);

        this.searchBox = searchBox;
        if (this.searchBox) {
            this.searchBox.addEvent('search', (function (event) {
                var progressElement = new Element('div', { id: 'progressBar' })
                this.container.grab(progressElement);

                this.loadedFeeds = 0;
                this.loaded = false;

                //fades out the tooltip
                $('slogan').fade('out');

                this.progressBar = new MoogressBar(progressElement, {
                    label: false,
                    onFinish: function () {
                        progressElement.getParent().removeChild(progressElement);
                    }
                });
                this.numberOfFeeds = this.feeds.length;
            }).bind(this));
        } else {

            this.loaded = true;
        }
    },

    /**
    * Function: addFeed
    * Adds a feed to this container
    *
    * Paramaters:
    *     feed - The feed to add
    */
    addFeed: function (feed) {
        this.feeds.push(feed);
        feed.addEvent('feedReady', (function (amount) {
            this.loadedFeeds++;
            //console.log("Feed", feed.name, "is loaded");
            //increment loading bar
            var progressWidth = this.progressBar.setPercentage(this.loadedFeeds / this.numberOfFeeds * 100);
            if (this.loadedFeeds == this.numberOfFeeds) {
                //hide loading bar\
                this.loaded = true;
            }
        }).bind(this));
    },

    /**
    * Function: addDisplayBox
    * Adds a <DisplayBox> to the <Containers> <displayBoxQueue>. <DisplayBoxes>
    * will be added in the future at a time decided by the <Container>.
    *
    * Paramaters:
    *     displayBox - The <DisplayBox> to add
    *
    * See Also:
    *     - <queueAddDisplayBox>
    */
    addDisplayBox: function (displayBox) {
        this.displayBoxQueue.push(displayBox);
        this.queueAddDisplayBox();
    },

    /**
    * Function: addDisplayBoxFromQueue
    * Adds a <DisplayBox> from the <displayBoxQueue>. This method will then
    * call <queueAddDisplayBox>, to add any more queued <DisplayBoxes>
    *
    * Paramaters:
    *     displayBox - The <DisplayBox> to add
    *
    * See Also:
    *     - <addDisplayBox>
    *     - <queueAddDisplayBox>
    */
    addDisplayBoxFromQueue: function () {
        var displayBox = this.displayBoxQueue.removeRandom();
        if (!displayBox) {
            // The queue may have been emptied since this function was queued.
            return;
        }

        // Get the preview to display
        var preview = displayBox.getPreview();

        // Add it to the container
        preview.fade('hide');
        this.container.grab(preview);
        this.container.masonry({
            appendContent: [preview]
        });
        preview.fade('in');
        displayBox.fireEvent('preview');

        // Tell the display box about this container
        displayBox.setContainer(this);
        this.displayBoxes.push(displayBox);

        // Add another if we need to
        this.queueTimer = null;
        this.queueAddDisplayBox();
    },

    /**
    * Function: queueAddDisplayBox
    * Make a periodical function to add a queued <DisplayBox> from
    * <displayBoxQueue>. This function will only run if there are
    * <DisplayBoxes> to add, and the periodical function is not already
    * running.
    *
    * See Also:
    *     - <addDisplayBox>
    *     - <addDisplayBoxFromQueue>
    */
    queueAddDisplayBox: function () {
        // Check it is not already queued
        if (!$chk(this.queueTimer)) {
            if (this.displayBoxQueue.length !== 0 && this.loaded) {
                this.queueTimer = this.addDisplayBoxFromQueue.delay(this.queueDelay);
            } else {
                this.queueTimer = null;
            }
        }
    },

    /**
    * Function: getDisplayBoxes
    * Get all the DisplayBoxes being managed by this Container
    *
    * Returns:
    *     An array containing the DisplayBoxes in this Container
    */
    getDisplayBoxes: function (feed) {
        return this.displayBoxes;
    },

    /**
    * Function: removeDisplayBox
    * Remove a display box from the Container
    *
    * Paramaters:
    *     displayBox - The DisplayBox to remove. If the DisplayBox is not present, this function does nothing.
    */
    removeDisplayBox: function (displayBox) {
        displayBox.setContainer(null);
        this.displayBoxes.erase(displayBox);
        this.displayBoxQueue.erase(displayBox);
        if (this.container.hasChild(displayBox.getPreview())) {
            this.container.removeChild(displayBox.getPreview());
        }
    },

    removeAllDisplayBoxes: function () {
        var displayBoxes = this.getDisplayBoxes();
        while (displayBoxes.length) {
            this.removeDisplayBox(displayBoxes[0]);
        }
    },

    /**
    * Function: getElement
    * Get the element that this Container is putting its DisplayBoxes in
    *
    * Returns:
    *     The Element the Container manages
    */
    getElement: function () {
        return this.container;
    },

    show: function () {
        this.getElement().setStyle('display', null);
    },
    hide: function () {
        this.getElement().setStyle('display', 'none');
    }

});

/*
Class: FeedToggle

License:
    MIT-style license.

Copyright:
    Copyright (c) 2010 explore.travellr.com

Dependencies:
    - MooTools-core 1.2.4 or higher
    - MooTools-more 1.2.4.4 RC1 or higher
     */
var FeedToggle = new Class({

    data: null,

    /**
     * Variable: container
     * The <MooTools::Element> that the <FeedToggle> is displayed in
     */
    container: null,

    /**
     * Constructor: initialize
     * Create a new <FeedToggle> class. It will put the controls for its <Feeds>
     * in the container <MooTools::Element> supplied
     *
     * Paramaters:
     *     container - The <MooTools::Element> to put the controls in
     */
    initialize: function(container) {
        this.container = $(container);
    },

    /**
     * Function: addFeed
     * Add a <Feed> to this <FeedToggle>
     *
     * Paramaters:
     *     feed - The <Feed> to add to the <FeedToggle>
     */
    addFeed: function(feed) {
        var button = new Element('li', {
            text: feed.name , //+ ' on/off',
            'class': feed.name+ 'feed_toggle'
        });

        button.addEvent('click', function(event) {
            var isVisible = !feed.isVisible();
            //event.stop();

            feed.setVisible(isVisible);

            if (isVisible) {
                button.removeClass('off');
                button.addClass('on');
            } else {
                button.removeClass('on');
                button.addClass('off');
            }

        });

        this.container.grab(button);
    }
});
