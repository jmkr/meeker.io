(function($){

    var Meeker = {
        $_header: null,
        $_nav: null,
        
        setTweet: function(tweet, tweetTime){
            $("#tweets").html(tweet);
            $(".thoughtBubble").show();
            $("#tweetTime").html(". . . " + tweetTime);
            $("#tweetTime").show();
        },

        initTwitter: function(){

            /* No longer can you hit Twitter API V1!!
             * But luckily, 'gon' is the shit and lets you pass rails variables from
             * controllers to JS. Twist and shout.
             */
            if (gon.tweet != null) {
                tweetContent = Meeker.formatTweet(gon.tweet.content);
                tweetTime = Meeker.timeAgo(gon.tweet.created);
                Meeker.setTweet(tweetContent, tweetTime);
            }
        },

        formatTweet: function(text) {
            text = Meeker.linkURLs(text);
            text = Meeker.linkHashes(text);
            text = Meeker.linkMentions(text);
            return text;
        },

        linkHashes: function(text) {
            var hash, hashes, url, _i, _len;
            hashes = text.match(/\#[\w]*/gi);
            if (hashes != null) {
                for (_i = 0, _len = hashes.length; _i < _len; _i++) {
                    hash = hashes[_i];
                    url = '<a href="http://twitter.com/search/%23' + hash.replace("#", "") + '">' + hash + '</a>';
                    text = text.replace(hash, url);
                }
            }
            return text;
        },

        linkMentions: function(text) {
            var mention, mentions, url, username, _i, _len;
            mentions = text.match(/@[\w]*/gi);
            if (mentions != null) {
                for (_i = 0, _len = mentions.length; _i < _len; _i++) {
                    mention = mentions[_i];
                    username = mention.replace("@", "");
                    url = '<a href="http://twitter.com/' + username + '">' + '@' + username + '</a>';
                    text = text.replace(mention, url);
                }
            }
            return text;
        },

        linkURLs: function(text) {
            var url, urls, _i, _len;
            urls = text.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi);
            if (urls != null) {
                for (_i = 0, _len = urls.length; _i < _len; _i++) {
                    url = urls[_i];
                    text = text.replace(url, '<a href="' + url + '">' + url + '</a>');
                }
            }
            return text;
        },

        initPhotos: function(){    
            $(".photo-feed").hide();
            var imgs = $(".rss-item").hide();
            // Make sure these shite pictures are actually loaded
            if(imgs.size() < 1){
                setTimeout(function(){Meeker.initPhotos()},100);
            }else{
                $(".photo-feed").show();
                Meeker.showPhotos(0, imgs);
            }
        },

        showPhotos: function(i, imgs){                
                //escape on last image
                if(i >= imgs.size()){ return; }                
                
                // Apply top bounce-in class to odd rows and bottom bounce-in to even rows
                if((Math.ceil((i+1)/4))%2 == 1)
                {
                    imgs.eq(i).addClass('bounceTop'+((i%4)+1));
                } else {
                    imgs.eq(i).addClass('bounceBottom'+((i%4)+1));
                }

                imgs.eq(i).fadeIn(200, function(){ Meeker.showPhotos(i+1, imgs); $(imgs).eq(i).css('opacity','1');});
        },

        timeAgo: function(dateString){
            var rightNow = new Date();
            var then = new Date(dateString);
         
            // if ($.browser.msie) {
            //     // IE can't parse for poop
            //     then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
            // }
 
            var diff = rightNow - then;
 
            var second = 1000,
              minute = second * 60,
              hour = minute * 60,
              day = hour * 24,
              week = day * 7;
 
            if (isNaN(diff) || diff < 0) {
                return "";
            }
 
            if (diff < second * 2) return "right now";
            if (diff < minute) return Math.floor(diff / second) + " seconds ago";      
            if (diff < minute * 2) return "about 1 minute ago";
            if (diff < hour) return Math.floor(diff / minute) + " minutes ago";
            if (diff < hour * 2) return "about 1 hour ago";
            if (diff < day) return  Math.floor(diff / hour) + " hours ago";
            if (diff > day && diff < day * 2) return "yesterday";
            if (diff < day * 365) return Math.floor(diff / day) + " days ago";
            else return "over a year ago";
        },

        pinHeader: function(){
            this._$header.addClass('fader');        
        },

        unpinHeader: function(){
            this._$header.removeClass('fader');
        },

        initBindings: function(){
            this._$header = $('.topBar');
            this._$nav = $('.topBar ul.nav li a');
            
            $('ul li a, a').bind('click',function(event){
                var $anchor = $(this);
                var offset = 350;

                //fix for navbar links not animating while on home page
                if(window.location.pathname =="/"){
                    if($anchor.attr('href').charAt(0)=="/"){
                        $anchor[0].href = $anchor.attr('href').slice(1);
                    }
                }

                $('html, body').stop().animate({
                    scrollTop: $($anchor.attr('href')).offset().top - offset
                }, 2000,'easeInOutExpo');
                event.preventDefault();
            });
        },

        initHeader: function(){

            $(document).scroll(
                function(){

                    if ( $(window).width() > 480  && $(window).width() <= 768 ) {
                        if( $(document).scrollTop() > 0){
                            Meeker.pinHeader();
                        }else{
                            Meeker.unpinHeader();
                        }
                    } else {
                       if( $(document).scrollTop() > ($(window).height() - 125) ){
                            Meeker.pinHeader();
                        }else{
                            Meeker.unpinHeader();
                        } 
                    }

                    //navbar scrollspy on homepage
                    if(window.location.pathname == "/"){
                        
                        //highlight About Icon 
                        if( $(document).scrollTop() > 675  && $(document).scrollTop()<1600){                            
                            Meeker.highlightHeader(0);                            
                        }
                        else{
                            Meeker.highlightHeader(-1);
                        }
                    }
                }
            );        
        },

        initTyper: function(){
            setTimeout(function() {
                $('[data-typer-targets]').typer();    
            }, 7500);
        },

        initBackgroundImage: function(){
            var img = new Image();
            img.src = 'assets/bgRailsColor.png';
            img.onload = function() {
                $(".rails" ).attr("style", "background-image:url('" + img.src + "')");
                $(".landingInfo" ).attr("style", "display:block");
            };
        },

        //Scrollspy & Nav Function => gets -1 for any area not to be highlighted and 'num' corresponds to indexOf anchor in nav to be highlighted
        highlightHeader: function(num){
            this._$nav.removeClass('current');
            if(num >= 0 ){
                this._$nav.eq(num).addClass('current');
            }
        },

        init: function(loaded){
            if(loaded){
                if(window.location.pathname == "/photos"){
                    Meeker.highlightHeader(4);
                    Meeker.initPhotos();                    
                }
            }
            
            else{
                $(document).ready(function() {
                    Meeker.initBindings();
                    Meeker.initHeader();
                    Meeker.initBackgroundImage();

                    if(window.location.pathname == "/"){              
                        Meeker.initTwitter();
                    }
                });                
                           
                $(window).load(function(){
                    Meeker.init(true);
                });
            }
        }

    };

    Meeker.init();

}(jQuery));

            
        
