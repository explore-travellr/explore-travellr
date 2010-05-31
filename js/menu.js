window.addEvent('domready', function() {

    //Sets search suggestion box to be invisible
    $$('.speechBubble').setStyle('opacity','0');

    $('searchField').addEvents({
        // when the text input is focused, either through click in or using tab,
        // fade the suggestion box to 95% opacity
        focus: function() {
            $$('.speechBubble').fade('0.95');
            if ($('searchField').value.contains('Swimming in Mount Vesuvius')) $('searchField').value = '';
        },
        // Fade out when the keyboard is pressed
        keypress: function() {
            $$('.speechBubble').fade('out');
        },
        // Fade out when the field loses focus
        blur: function() {
            $$('.speechBubble').fade('out');
        }
    });

    // Fill out the search box when a suggestion is clicked
    $$('.suggestion').addEvent('click', function() {
        $('searchField').set('value', this.get('text'));
    });

    //Sets footer info to be invisible
    $$('.infoDesc').setStyle('opacity','0');
    $$('.infoDesc').setStyle('display','none');
    $$('.infoBubble').setStyle('opacity','0');

    $$('.info').addEvent('click', function() {
        $$('.infoBubble').fade('0.95');
    });

    $('infoClose').addEvent('click', function() {
        $$('.infoBubble').fade('out');
    });

    // Set up the default transition for the infobubble arrow
    $('infoCorner').set('tween', {
        duration: 1000,
        transition: Fx.Transitions.Back.easeOut
    });

    // The following code snippets show the info bubble and move the arrow
    // to point to the link clicked
    // TODO Combine them into one dynamic code block
    var hideInfoBubbles = function() {
        $$('.infoDesc').fade('out');
        $$('.infoDesc').setStyle('display','none');
        $$('.infoDesc').setStyle('visibility','hidden');
    }
    $('about').addEvents({
        click: function() {
            hideInfoBubbles();
            $('infoCorner').tween('margin-left','13px');
            $('infoAbout').setStyle('display','block');
            $('infoAbout').fade('in');
        }
    });
    $('partners').addEvents({
        click: function() {
            hideInfoBubbles();
            $('infoCorner').tween('margin-left','82px');
            $('infoPartners').setStyle('display','block');
            $('infoPartners').fade('in');
        }
    });
    $('terms').addEvents({
        click: function() {
            hideInfoBubbles();
            $('infoCorner').tween('margin-left','190px');
            $('infoTerms').setStyle('display','block');
            $('infoTerms').fade('in');
        }
    });
    $('contact').addEvents({
        click: function() {
            hideInfoBubbles();
            $('infoCorner').tween('margin-left','305px');
            $('infoContact').setStyle('display','block');
            $('infoContact').fade('in');
        }
    })
});