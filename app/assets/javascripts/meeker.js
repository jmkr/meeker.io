(function($){

  var Meeker = {
    initBindings: function() {
      $('.arrow-icon').bind('click',function(event) {
        var $anchor = $(this);
        var offset = 0;

        $('html, body').stop().animate({
          scrollTop: $($anchor.attr('href')).offset().top - offset
        }, 2000,'easeInOutExpo');
        event.preventDefault();
      });
    },

    initBackgroundImage: function() {
      var img = new Image();
      img.src = 'assets/bgRailsColor.png';
      img.onload = function() {
        $(".landing" ).attr("style", "background-image:url('" + img.src + "')");
        $(".info-wrapper" ).removeClass('hide');
      };
    },

    init: function(loaded) {
      $(document).ready(function() {
        Meeker.initBindings();
        Meeker.initBackgroundImage();
      });

      $(window).load(function() {
        Meeker.init(true);
      });
    }
  };

  Meeker.init();

}(jQuery));
