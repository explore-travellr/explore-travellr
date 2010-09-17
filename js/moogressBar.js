/*
Class: MoogressBar
    With moogressBar you can easily create a progress bar powered by mooTools

License:
	MIT-style license.
   
Version: 
	0.5.2

Authors:
	- Christopher Beloch
	- Arian Stolwijk (code improvements 0.2 -> 0.3)

Dependencies:
   - <MooTools::core> 1.2.4 or higher
   - <MooTools::more> 1.2.4.4 RC1 or higher
*/

var MoogressBar = new Class({

	Implements: [Options, Events],
	
	options: {
		bgImage: 'blue.gif',  // What is the background-image?
		percentage: 0,  // Start at which percentage?
		height: 20,  // Height of the bar
		hide: true, // Hide the bar on 100%?
		label: false, // show percentage?
		fx: { // The effects for the scroll, set to null or false if you don't want this effect
			unit: '%',
			duration: 'normal',
			property: 'width'
		} /*,
		onChange: $empty,
		onFinish: $empty
		*/
	},
	
	initialize: function(parent,options){
		this.setOptions(options);
		this.parent = document.id(parent)
			.setStyle('z-index',999);
		
		// Set the current percentage
		this.current = this.options.percentage;
		
		// Draw bar
		this.bar = new Element('div', {
			'styles': {
				'display': 'block',
				'width': this.options.percentage + '%',
				'height': this.options.height,
				'text-align': 'center',
				'line-height': this.options.height + 'px',
				'color': '#365F91',
				// Border Radius deactivated, because Firefox is causing drawing problems
				'border-radius': '4px 0px 0px 4px',
				'-webkit-border-radius': '4px 0px 0px 4px',
				'-moz-border-radius': '4px 0px 0px 4px'
			}
		}).inject(parent);
		
		
        if(this.options.label)
		{
			Element('span', {
				'text': this.options.percentage + "%"
			}).inject(this.bar);
		}
		
		// Will it be Animated?
		if(this.options.fx)
		{
			this.fx = new Fx.Tween(this.bar, this.options.fx);
			this.labelFx = new Fx.Counter(this.bar, this.options.fx, "stupid");
		}
	},
	
	// function to modify the percentage status
	setPercentage: function(percentage){
		if(this.fx){
			// Fire the events when the fx is complete
			this.labelFx.start(this.current, percentage);
			
			this.fx.addEvent('complete',function(){
				if(percentage >= 100){
					this.fireEvent('finish');
					
					// hide bar
					if(this.options.hide){
						this.parent.tween('opacity', 0).tween('width', 0).tween('height', 0);
						this.fx.set('opacity', 0);
					}
				}
				this.fireEvent('change',percentage);
			}.bind(this));
		}else{
			// Fire the events immediately when there's no fx
			// this.bar.set('text', percentage + "%");
			this.fireEvent('change',percentage);
			if(percentage >= 100){
				this.fireEvent('finish');
				
				if(this.options.hide){
					this.parent.setStyle('display', 'none');
				}
			}
		}

		// Change the percentage bar
		if(this.fx) {
			this.fx.cancel().start(this.bar.getStyle('width').toInt(), percentage);
		} else {
			this.bar.setStyle('width', percentage + '%');
		}

		// Change the current percentage
		this.current = percentage;
	},
	
	getPercentage: function(){
		return this.current;
	},
	
	toElement: function(){
		return this.parent;
	},

	increasePercentage: function(percentage) {
		this.setPercentage(this.current + percentage);
	}
});

// The following Block is the same as Fx.Log shown here: 
// http://mootools.net/blog/2010/05/18/a-magical-journey-into-the-base-fx-class/

Fx.Counter = new Class({
    
    Extends: Fx,
    
    initialize: function(element, options, after){
        this.parent(options);
        this.after = after;
        this.element = document.id(element);
    },
    
    set: function(now){
        this.element.set('text', 'Loading Results...');
        return this;
    }
    
});