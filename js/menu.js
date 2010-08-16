//when the dom is ready
window.addEvent('domready', function() {

          $$('.feed_toggle').addEvents({
                    'click': function(){
		
                              if($(this).hasClass('on')){
                                        $(this).removeClass('on');
                                        $(this).addClass('off');
                              }
                              else{
                                        $(this).removeClass('off');
                                        $(this).addClass('on');
                              }
				
                    }
		
		
          });
	


          //Hide & Display dropdown menus on moueover & mouseout
          $$('.dropdown').setStyle('display','none');

          var showMenu = function(event){
                    event.stop();
                    $(this).addClass('button_hover');
                    $(this).getElement('.dropdown').setStyle('display','block');
          };
	
          var hideMenu = function(){
                    $(this).removeClass('button_hover');
                    $(this).getElement('.dropdown').setStyle('display','none');
          };

          //sets drop bar boolean as false on load
          var dropBarVisible = false;

          var mySlide = new Fx.Slide($('favourites_dropdown'), { duration: 400, wrapper: 'favourites_wrapper'  }).hide();



          $$('.toolbar_button').addEvents({
                    'mouseover': showMenu,
                    'mouseout': hideMenu,
                    'click': showMenu
          });
          $$('.fav_button').addEvent('click', function(event) {
                    event.stop();

                    
                    //mySlide.slideOut(); //My element slides out of view

                    mySlide.toggle();  //will slide back in now because it
          //was hidden:
          // mySlide.toggle();

          //                  if (dropBarVisible) {
          //                               //hide drop bar
          //                               $(this).getElement('.dropdown').setStyle('display','none');
          //                              dropBarVisible = false;
          //                   }
          //                    else {
          //                              //show drop bar
          //                              $(this).getElement('.dropdown').setStyle('display','block');
          //                             dropBarVisible = true;
          //                  }
          });
});

	


