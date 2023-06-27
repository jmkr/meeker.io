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

    init: function(loaded) {
      $(document).ready(function() {
        Meeker.initBindings();
      });

      $(window).load(function() {
        Meeker.init(true);
        $(".info-wrapper" ).removeClass('hide');
      });
    }
  };

  Meeker.init();

}(jQuery));
