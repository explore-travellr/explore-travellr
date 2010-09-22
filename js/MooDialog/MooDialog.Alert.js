/*
---
description:     MooDialog

authors:
  - Arian Stolwijk

license:
  - MIT-style license

requires:
  core/1.2.4:   '*'

provides:
  - [MooDialog.Alert]
...
*/

MooDialog.Alert = new Class({	
	
	Extends: MooDialog,	

	options: {
		okText: 'Ok',
		focus: true
	},

	initialize: function(msg, options){
		this.parent(options);
		
		var okButton = new Element('input', {
			type: 'button',
			events: {
				click: this.close.bind(this)
			},
			value: this.options.okText
		});
		
		this.setContent(
			new Element('div').adopt(
					new Element('p', {
						'class': 'MooDialogAlert',
						text: msg
					})
				).adopt(
					new Element('div', {
						'class': 'buttons'
					}).adopt(okButton)
				)
		).open();	

		if (this.options.focus) this.addEvent('show', function(){
			okButton.focus()
		});

	}
});

