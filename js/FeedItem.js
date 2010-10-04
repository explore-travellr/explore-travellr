/*
Class: FeedItem
   MooTools based generic feed item handler

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - <MooTools::core> 1.2.4 or higher
   - <MooTools::more> 1.2.4.4 RC1 or higher
*/

var FeedItem = new Class({

    Implements: [Options, Events],

    /**
     * Variable: displayBox
     * The <DisplayBox> that displays this <FeedItem>
     *
     * See Also:
     *     - <setDisplayBox>
     *     - <getDisplayBox>
     */
    displayBox: null,

    /**
     * Variable: size
     * A <JS::Object> containing the width (x) of the FeedItem preview
     *
     * See Also:
     *     - <getSize>
     */
    size: null,

    /**
     * Variable: previewLoaded
     * If the <FeedItem> preview is ready for display. Feeds can override this
     * and implement preloading of eg. images. If they do this, the previewLoaded
     * event must be fired to indicate the preview is loaded, and this variable
     * toggled to true
     */
    previewLoaded: true,

    /**
     * Variable: contentLoaded
     * If the <FeedItem> content is ready for display. Feeds can override this
     * and implement preloading of eg. images. If they do this, the contentLoaded
     * event must be fired to indicate the content is loaded, and this variable
     * toggled to true
     */
    contentLoaded: true,

    /**
     * Constructor: intialize
     * Abstract constructor. Subclasses should implement this
     */
    initialize: function() { },

    /**
     * Function: getContent
     * Get the content of the <FeedItem>. The content returned is cached. Only
     * one copy of the content is ever returned. Subsequent calls to this method
     * will return the same <MooTools::Element>.
     *
     * Returns:
     *     The <MooTools::Element> containing the content of this <FeedItem>
     *
     * See Also:
     *     - <content>
     *     - <makeContent>
     */
    getContent: function() {
        var content = this.makeContent();
        content.store('FeedItem', this);
        return content;
    },

    /**
     * Function: makeContent
     * Creates a <MooTools::Element> with the contents of this FeedItem
     */
     makeContent: function() { },

    /**
     * Function: getPreview
     * Get the preview of the <FeedItem>. The preview returned is cached. Only
     * one copy of the preview is ever returned. Subsequent calls to this method
     * will return the same <MooTools::Element>
     *
     * Returns:
     *     The <MooTools::Element> containing the preview of this <FeedItem>
     *
     * See Also:
     *     - <preview>
     *     - <makePreview>
     */
    getPreview:function() {
        var preview = this.makePreview();
        preview.store('FeedItem', this);
        return preview;
    },

    /**
     * Function: makePreview
     * Creates a <MooTools::Element> with a preview of this FeedItem
     */
     makePreview: function() { },

    /**
     * Function: getSize
     * Get the size of the preview
     *
     * Returns:
     *     An object containing an x and y parameter of the size
     */
    getSize: function() {
        return this.size;
    },
    
    /**
     * Function: setDisplayBox
     * Sets the <DisplayBox> that manages this <FeedItem>
     *
     * Parameters:
     *     displayBox - The <DisplayBox> that will manage this <FeedItem>
     *
     * See Also:
     *     - <getDisplayBox>
     *     - <displayBox>
     */
    setDisplayBox: function(displayBox) {
        this.displayBox = displayBox;
    },

    /**
     * Function: getDisplayBox
     * Returns the <DisplayBox> that manages this <FeedItem>
     *
     * Returns:
     *     The <DisplayBox> that will manage this <FeedItem>
     *
     * See Also:
     *     - <setDisplayBox>
     *     - <displayBox>
     */
    getDisplayBox: function() {
        return this.displayBox;
    },
	
    /**
     * Function: toDisplayBox
     * Returns a new <DisplayBox> that has this <FeedItem> details
     *
     * Returns:
     *     A new <DisplayBox> that has the current source
     */
    toDisplayBox: function(scrapbook, options) {
        return new DisplayBox(this, scrapbook, options);
    },

    /**
     * Function: canScrapbook
     * Returns if this <FeedItem> is capable of being Scrapbooked
     * 
     * Return:
     *      True if this <FeedItem> can be Scrapbooked, false otherwise
     */
    canScrapbook: function() {
        return true;
    },
	
    /**
     * Function: getDisplayBoxButtons
     * Build the view source link and returns the anchor tag
     * 
     * Return:
     *      The buttons array, currently only the source button
     */
    getDisplayBoxButtons: function(options) {
        var buttons = [];
        if (this.url) {
            var home = new Element('a', {
                href: this.url,
                title: 'View in a new window',
                'class': 'icon open-new-icon',
                target: '_blank'
            });
            buttons.push(home);
        }
        return buttons;
    },

    /**
     * Function: clone
     * Return a clone of this item
     */
    clone: function() {
        var err = new Error("Cloning not supported for this class");
        err.instance = this;
        throw err;
    }
});
