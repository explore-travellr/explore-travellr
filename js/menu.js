//when the dom is ready
window.addEvent('domready', function() {

    //Sets search suggestion box to be invisible
    $$('.speechBubble').setStyle('opacity','0');
    //Sets footer inof to be invisible
    $$('.infoDesc').setStyle('opacity','0');
    $$('.infoDesc').setStyle('display','none');



    $('searchField').addEvents({
        //when the text input is focused, either through click in or using tab, box fads to visible
        //0.9 is the opacity level
        focus: function() {
            $$('.speechBubble').fade('0.95');
            if ($('searchField').value.contains('Swimming in Mount Vesuvius')) $('searchField').value = '';
        },
        //keypress is any keyboard input
        keypress: function() {
            $$('.speechBubble').fade('out');
        },
        //blur is when the text box is de-focused
        blur: function() {
            $$('.speechBubble').fade('out');
        }
    });

    $$('.suggestion').addEvent('click', function() {
        $('searchField').set('value', this.get('text'));
    });

    $$('.infoBubble').setStyle('opacity','0');

    $$('.info').addEvents({
        click: function() {
            $$('.infoBubble').fade('0.95');
        }
    });

    $('infoClose').addEvents({
        click: function() {
            $$('.infoBubble').fade('out');
        }
    });

    //this snippet should set a transition for the tween
    $('infoCorner').set('tween', {
        duration: 1000,
        transition: Fx.Transitions.Back.easeOut
        });

    //moves the blue pointer to ABOUT
    $('about').addEvents({
        click: function() {
            $$('.infoDesc').fade('out');
            $$('.infoDesc').setStyle('display','none');
            $$('.infoDesc').setStyle('visibility','hidden');
            $('infoCorner').tween('margin-left','13px');
            $('infoAbout').setStyle('display','block');
            $('infoAbout').fade('in');
        }
    });

    //moves the blue pointer to PARTNERS
    $('partners').addEvents({
        click: function() {
            $$('.infoDesc').fade('out');
            $$('.infoDesc').setStyle('display','none');
            $$('.infoDesc').setStyle('visibility','hidden');
            $('infoCorner').tween('margin-left','82px');
            $('infoPartners').setStyle('display','block');
            $('infoPartners').fade('in');
        }
    });

    //moves the blue pointer to TERMS and CONDITIONS
    $('terms').addEvents({
        click: function() {
            $$('.infoDesc').fade('out');
            $$('.infoDesc').setStyle('display','none');
            $$('.infoDesc').setStyle('visibility','hidden');
            $('infoCorner').tween('margin-left','190px');
            $('infoTerms').setStyle('display','block');
            $('infoTerms').fade('in');
        }
    });

    //moves the blue pointer to CONTACT
    $('contact').addEvents({
        click: function() {
            $$('.infoDesc').fade('out');
            $$('.infoDesc').setStyle('display','none');
            $$('.infoDesc').setStyle('visibility','hidden');
            $('infoCorner').tween('margin-left','305px');
            $('infoContact').setStyle('display','block');
            $('infoContact').fade('in');
        }
    })
});