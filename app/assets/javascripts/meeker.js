(function($){

  var Meeker = {
    $_header: null,
    $_nav: null,

    initBindings: function() {
      this._$header = $('.topBar');
      this._$nav = $('.topBar ul.nav li a');

      $('ul li a, a').bind('click',function(event) {
        var $anchor = $(this);
        var offset = 250;

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
        $(".arrow-container" ).attr("style", "display:block");
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
