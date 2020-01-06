$(function() {
	// ======================= imagesLoaded Plugin ===============================
	// https://github.com/desandro/imagesloaded

	// $('#my-container').imagesLoaded(myFunction)
	// execute a callback when all images have loaded.
	// needed because .load() doesn't work on cached images
	// callback function gets image collection as argument
 
$.fn.imagesLoaded = function( callback ){
  var elems = this.find( 'img' ),
      elems_src = [],
      self = this,
      len = elems.length;
 
  if ( !elems.length ) {
    callback.call( this );
    return this;
  }
 
  elems.one('load error', function() {
    if ( --len === 0 ) {
      // Rinse and repeat.
      len = elems.length;
      elems.one( 'load error', function() {
        if ( --len === 0 ) {
          callback.call( self );
        }
      }).each(function() {
        this.src = elems_src.shift();
      });
    }
  }).each(function() {
    elems_src.push( this.src );
    // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
    // data uri bypasses webkit log warning (thx doug jones)
    this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
  });
 
  return this;
  /*return $(this).each( function () { });*/
};
    
    setESCarousel = function(item){
        function activateTextExpander(item){
            var interval = 400, clicker = $(item), 
                txtSpacer = '  ',
                captionWrap = clicker.parent(),
                upClass = 'expanded',dClass = 'shrunk';
            if(captionWrap.hasClass(upClass)){
                captionWrap.removeClass(upClass);
                captionWrap.addClass(dClass);            
            }
            else {
                captionWrap.removeClass(dClass);
                captionWrap.addClass(upClass);            
            }
            setTimeout(function(){clicker.html(txtSpacer);},interval);
            return false;
        }
    
        if(item == null){
            //activate text-expander on single images
            $('.rg-standalone-image .rg-caption-wrapper .text-expander').css('display','block').click(function(){
                return activateTextExpander(this);
            });
        }
        else {
	
            // multiple instance gallery container
            $(item).each(function() {
            // carousel container	
            var g = galleryIndex, $rgGallery=$(this).attr('id', "rg-gallery" + (g + 1)),// loads one
            $esCarousel			= $rgGallery.find('div.es-carousel-wrapper').attr('id', 'es-carousel-' + (g + 1)),
            // the carousel items
            $items				= $esCarousel.find('ul > li'),
            // total number of items
            itemsCount			= $items.length;	
            //$(this).attr('id', "rg-gallery" + (g + 1));
            //$(this).find('div.es-carousel-wrapper').attr('id', 'es-carousel-' + (g + 1));
            //$(this).attr('id', "rg-gallery" + (g + 2));
            //$(this).find('div.es-carousel-wrapper').attr('id', 'es-carousel-' + (g + 1));


            Gallery				= (function() {

                    // this block is basically a dynamic variable factory - on each pass, meaning number of instances of rgGallery on page, new current variables are created
                    // sets a variable with a string-value
                    // the value of this variable will become the name of a dynamic variable
                    var instanceNumber = (g + 1);
                    var instanceNumberToString = instanceNumber.toString();
                    //alert("instanceNumber.toString() = "+instanceNumberToString);

                    // build a new variable name
                    window['currentDynamic'+instanceNumberToString] = (g);// creates the "currentDynamic+'g'" variable


                    // index of the current item - using new dynamic current variable
                    var currentDynamic			= 0, 
                    // mode : carousel || fullview
                    mode 			= 'carousel',
                    // control if one image is being loaded
                    anim			= false,
                    init			= function() {

                        // (not necessary) preloading the images here...
                        $items.add('').imagesLoaded( function() {
                            // add options
                            _addViewModes();

                            // add large image wrapper
                            _addImageWrapper();

                            // show first image
                            _showImage( $items.eq( currentDynamic ) );

                        });

                        // initialize the carousel
                        if( mode === 'carousel' )
                            _initCarousel();

                    },
                    _initCarousel	= function() {

                        // we are using the elastislide plugin:
                        $esCarousel.show().elastislide({
                            imageW 	: 55,
                            onClick	: function( $item ) {
                                if( anim ) return false;
                                anim	= true;
                                // on click show image
                                _showImage($item);
                                // change currentDynamic
                                currentDynamic	= $item.index();
                            }
                        });

                        // set elastislide's current to current
                        //$esCarousel.elastislide( 'setCurrent', current );

                        // set elastislide's current to current
                        var $rgCarousel = $rgGallery.find('.es-carousel-wrapper').attr('id', 'es-carousel-' + (g + 1));
                        //$('#' + $esCarousel).elastislide( 'setCurrent', currentDynamic );
                        $rgCarousel.elastislide( 'setCurrent', currentDynamic );

                    },
                    _addViewModes	= function() {

                        // top right buttons: hide / show carousel

                        var $viewfull	= $('<a href="#" class="rg-view-full"></a>'),
                            $viewthumbs	= $('<a href="#" class="rg-view-thumbs rg-view-selected"></a>');

                        $rgGallery.prepend( $('<div class="rg-view"/>').append( $viewfull ).append( $viewthumbs ) );

                        $viewfull.on('click.rgGallery', function( event ) {
                                if( mode === 'carousel' )
                                    $rgCarousel.elastislide( 'destroy' );
                                $rgCarousel.hide();
                            $viewfull.addClass('rg-view-selected');
                            $viewthumbs.removeClass('rg-view-selected');
                            mode	= 'fullview';
                            return false;
                        });

                        $viewthumbs.on('click.rgGallery', function( event ) {
                            _initCarousel();
                            $viewthumbs.addClass('rg-view-selected');
                            $viewfull.removeClass('rg-view-selected');
                            mode	= 'carousel';
                            return false;
                        });

                        if( mode === 'fullview' )
                            $viewfull.trigger('click');

                    },
                    _addImageWrapper= function() {

                        // adds the structure for the large image and the navigation buttons (if total items > 1)
                        // also initializes the navigation events

                        //If thumbnail carousel should be rendered at top - use appendTo				
                        $('#img-wrapper-tmpl').tmpl( {itemsCount : itemsCount} ).prependTo( $rgGallery );

                        if( itemsCount > 1 ) {
                            // addNavigation
                            var $navPrev		= $rgGallery.find('a.rg-image-nav-prev').attr('id', 'nav-prev-' + (g + 1)),
                                $navNext		= $rgGallery.find('a.rg-image-nav-next').attr('id', 'nav-next-' + (g + 1)),
                                $imgWrapper		= $rgGallery.find('div.rg-image');

                            $navPrev.on('click.rgGallery', function( event ) {
                                _navigate( 'left' );
                                return false;
                            });	

                            $navNext.on('click.rgGallery', function( event ) {
                                _navigate( 'right' );
                                return false;
                            });



                            $navPrev.on('click.rgGallery', function( event ) {
                                _navigate( 'left' );
                                return false;
                            });	

                            $navNext.on('click.rgGallery', function( event ) {
                                _navigate( 'right' );
                                return false;
                            });

                            // add touchwipe events on the large image wrapper
                            $imgWrapper.touchwipe({
                                wipeLeft			: function() {
                                    _navigate( 'right' );
                                },
                                wipeRight			: function() {
                                    _navigate( 'left' );
                                },
                                preventDefaultEvents: false
                            });

                            $(document).on('keyup.rgGallery', function( event ) {
                                if (event.keyCode == 39)
                                    _navigate( 'right' );
                                else if (event.keyCode == 37)
                                    _navigate( 'left' );	
                            });

                        }

                    },
                    _navigate		= function( dir ) {

                        // navigate through the large images

                        if( anim ) return false;
                        anim	= true;

                        if( dir === 'right' ) {
                            if( currentDynamic + 1 >= itemsCount )
                                currentDynamic = 0;
                            else
                                ++currentDynamic;
                        }
                        else if( dir === 'left' ) {
                            if( currentDynamic - 1 < 0 )
                                currentDynamic = itemsCount - 1;
                            else
                                --currentDynamic;
                        }

                        _showImage( $items.eq( currentDynamic ) );

                    },
                    _showImage		= function( $item ) {

                        // shows the large image that is associated to the $item

                        var $loader	= $rgGallery.find('div.rg-loading').show();
 
                        $items.removeClass('selected');
                        $item.addClass('selected');

                        var $thumb		= $item.find('img'),
                            largesrc	= $thumb.data('large'),
                            title			= $thumb.data('title');
                            description	= $thumb.data('description');
                            n = description.search("—");
                            timestamp = description.slice(0,n);                    
                        		y = description.indexOf("—");
                       //check to see if there is a — i.e. a timestamp
                          if (y!==-1) {var description = "<span class='tstamp'>" + description.slice(0, n) + "</span>" + description.slice(n,10000);} 	
                           	//alert(description);
                           	 	

                        $('<img/>').load( function() {

                            //no fade
                            //$rgGallery.find('div.rg-image').empty().append('<img src="' + largesrc + '"/>');-->


                            //fade main images
                            $rgGallery.find('div.rg-image').fadeOut(500, function() { //Fade-Out
                            //if NO shadowbox link should be on main image
                            $rgGallery.find('div.rg-image').empty().append('<img src="' + largesrc + '"/>');
                            }).fadeIn(500); //Fade-In


                            if( description )
                             {
                              $rgGallery.find('div.rg-caption').show().children('p').empty().html( description );
                              $rgGallery.find('div.rg-caption').show().children('p').css({});
                              $rgGallery.find('div.rg-captiontitle').css({});
                             }
                            else
                             {
                              $rgGallery.find('div.rg-caption').show().children('p').empty().html( description );
                              $rgGallery.find('div.rg-caption').show().children('p').css({});
                              $rgGallery.find('div.rg-captiontitle').css({});
                             }	


                            if( title )
                             {
                              $rgGallery.find('div.rg-captiontitle').show().children('p').empty().text( title );
                              $rgGallery.find('div.rg-captiontitle').show().children('p').css({});
                              $rgGallery.find('div.rg-caption').show().children('p').css({});
                             }
                            else
                             {
                              $rgGallery.find('div.rg-captiontitle').show().children('p').empty().text( title );
                              $rgGallery.find('div.rg-caption').show().children('p').css({});
                             }	
                            
                            //call lightbox
                            var itemIndexzForLightBox= 0, itemImage = $item.children('a').children('img'),
                                descriptionForTitle = itemImage.attr('data-description');
                            
                            if(typeof $item.prevObject != 'undefined'){
                                for(var i = 0; i < $item.prevObject.length; i++){
                                    if($item.prevObject[i].className.indexOf('selected') > -1)itemIndexForLightBox = i;
                                }
                            }
                            else {
                                $item.parent().children('li').each(function(i){
                                    if($(this).hasClass('selected'))itemIndexForLightBox = i; 
                                });
                            }
                            
                            if(typeof descriptionForTitle == 'undefined' || !descriptionForTitle.length)descriptionForTitle = $item.children('a').children('img').attr('data-title');
                            
                            if(typeof descriptionForTitle == 'undefined' || !descriptionForTitle.length)descriptionForTitle = title;
                                $rgGallery.find('div.rg-captionshadowbox').show().children('p').append().html(('<a href="' + largesrc + '" rel="lightbox" title="' + descriptionForTitle + '~' + $esCarousel[0].id + '~' + itemIndexForLightBox + '"><img src="/media/home/images/shadowboxLaunch.png"></a>'));

                            if( itemsCount )
                                $rgGallery.find('div.rg-captioncount').show().children('p').empty().text( currentDynamic+1 +"/"+ itemsCount );


                            if(!$rgGallery.find('.rg-caption-wrapper .text-expander').length){
                                $rgGallery.find('.rg-caption-wrapper').append('<a href="#" class="text-expander">  </a>');
                                $rgGallery.find('.text-expander').css('display','block').click(function(){
                                    return activateTextExpander(this);
                                });
                            }

                            $loader.hide();

                            if( mode === 'carousel' ) {
                                $esCarousel.elastislide( 'reload' );
                                $esCarousel.elastislide( 'setCurrent', currentDynamic );
                            }

                            anim	= false;

                        }).attr( 'src', largesrc );

                    },
                    addItems		= function( $new ) {

                        $esCarousel.find('ul').append($new);
                        $items 		= $items.add( $($new) );
                        itemsCount	= $items.length; 
                        $esCarousel.elastislide( 'add', $new );

                    };

                return { 
                    init 		: init,
                    addItems	: addItems
                };

            })();

            Gallery.init();
        });
    }
  }
    
    var galleryIndex = 0;
    setESCarousel(null);
    $('.rg-gallery').each(function(){
        function setGallery(){
            if(loadCount == itemCount){
                setESCarousel(gallery);
                galleryIndex ++;
            }
            else setTimeout(function(){setGallery();},1000);
        }
        var gallery = $(this), galleryItems = gallery.find('.es-carousel ul li a'),
            itemCount = galleryItems.length,
            loadCount = 0;
        galleryItems.each(function(){ 
           var mainSrc = $(this).parent().attr('data-image') || '' ,
               thisImage = $(this).children('img');
           if(mainSrc.length > 0){
               var img = new Image();
               img.src = mainSrc;
               $(img).load(function() {
                   thisImage.attr('src',this.src);
                   thisImage.attr('data-large',this.src);
                   loadCount++;
               });
           }
            else if(thisImage.attr('src').length && thisImage.attr('data-large').length){
                loadCount++;
            }
        });
        setGallery();
    });
});