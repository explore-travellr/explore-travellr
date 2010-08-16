/*
Class: FeedItem
   FeedItem - MooTools based generic feed item handler

License:
   MIT-style license.

Copyright:
   Copyright (c) 2010 explore.travellr.com

Dependencies:
   - MooTools-core 1.2.4 or higher
   - MooTools-more 1.2.4.4 RC1 or higher
   - Utilities/Assets
   - FlickrFeedItem Class
   - TravellrFeedItem Class
   - TwitterFeedItem Class
   - WorldNomadsFeedItem Class
*/

var FeedItem = new Class({

    Implements: [Options, Events],
    
    // TODO Check if useless
    type: null,

    /**
     * Variable: displayBox
     * The <DisplayBox> that displays this <FeedItem>
     *
     * See Also:
     *     - <setDisplayBox>
     *     - <getDisplayBox>
     */
    content: null,

    /**
     * Variable: content
     * A <MooTools::Element> containing the large content view of this <FeedItem>
     *
     * See Also:
     *     - <getContent>
     *     - <makeContent>
     */
    content: null,

    /**
     * Variable: preview
     * A <MooTools::Element> containing the small preview content of this <FeedItem>
     *
     * See Also:
     *     - <getPreview>
     *     - <makePreview>
     */
    preview: null,

    /**
     * Variable: size
     * A <JS::Object> containing the width (x) of the FeedItem preview
     *
     * See Also:
     *     - <getSize>
     */
    size: null,

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
        if (!this.content) {
            this.content = this.makeContent();
        }
        return this.content;
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
        if (!this.preview) {
            this.preview = this.makePreview();
        }
        return this.preview;
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
     *     An object containing an x and y paramater of the size
     */
    getSize: function() {
        return this.size;
    },
    
    /**
     * Function: setDisplayBox
     * Sets the <DisplayBox> that manages this <FeedItem>
     *
     * Paramaters:
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
    }
});
