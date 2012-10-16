(function($){

    var Meeker = {
        $_header: null,
        $_user: null,

        setTweet: function(tweet, tweetText, tweetTime){
            $("#tweet").html(tweet);
            $(".thoughtBubble").show();
            //$("#tweet").typeTo(tweet);
            $("#tweetTime").html(". . . " + tweetTime);
            $("#tweetTime").show();
        },

        initTwitter: function($_user){
            var user = $_user;

            $.getJSON('http://api.twitter.com/1/statuses/user_timeline.json?screen_name=' + user + '&count=1&callback=?', function(data){        
                var tweet = "";
                var tweetTime = "";
                var tweetText = "";
                console.log(data.length);
                //for (i = 0; i < data.length; i++) {
                    tweet += data[0].text;
                    tweetTime += data[0].created_at;
                //}    

                tweetText = tweet;    
                tweet = tweet.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, function(url) {
                    return '<a target="_blank" href="'+url+'">'+url+'</a>';
                }).replace(/B@([_a-z0-9]+)/ig, function(reply) {
                    return  reply.charAt(0)+'<a href="http://twitter.com/'+reply.substring(1)+'">'+reply.substring(1)+'</a>';
                });  
                console.log(tweet);       
                tweetTime = Meeker.timeAgo(tweetTime);
                Meeker.setTweet(tweet, tweetText, tweetTime);
            });
        },

        initPhotos: function(){    
            $(".photo-feed").hide();
            var imgs = $(".rss-item").hide();
            // Make sure these shite pictures are actually loaded
            if(imgs.size() < 1){
                console.log("not ready");
                setTimeout(function(){Meeker.initPhotos()},100);
            }else{
                $(".photo-feed").show();
                Meeker.showPhotos(0, imgs);
            }
        },

        showPhotos: function(i, imgs){
                //console.log(imgs.size());
                //console.log(imgs.eq(i));
                console.log(i);

                //escape on last image
                if(i >= imgs.size()){ return; }                
                
                // Apply top bounce-in class to odd rows and bottom bounce-in to even rows
                if((Math.ceil((i+1)/4))%2 == 1)
                {
                    imgs.eq(i).addClass('bounceTop'+((i%4)+1));
                } else {
                    imgs.eq(i).addClass('bounceBottom'+((i%4)+1));
                }

                imgs.eq(i).fadeIn(150,function(){ Meeker.showPhotos(i+1, imgs); });
                //imgs.eq(i).show(function(){ Meeker.showPhotos(i+1, imgs); });                       
        },

        timeAgo: function(dateString){
            var rightNow = new Date();
            var then = new Date(dateString);
         
            if ($.browser.msie) {
                // IE can't parse for poop
                then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
            }
 
            var diff = rightNow - then;
 
            var second = 1000,
              minute = second * 60,
              hour = minute * 60,
              day = hour * 24,
              week = day * 7;
 
            if (isNaN(diff) || diff < 0) {
                return "";
            }
 
            if (diff < second * 2) {
                return "right now";
            }
      
            if (diff < minute) {
                return Math.floor(diff / second) + " seconds ago";
            }
      
            if (diff < minute * 2) {
                return "about 1 minute ago";
            }
      
            if (diff < hour) {
                return Math.floor(diff / minute) + " minutes ago";
            }
      
            if (diff < hour * 2) {
                return "about 1 hour ago";
            }
      
            if (diff < day) {               
                return  Math.floor(diff / hour) + " hours ago";
            }
      
            if (diff > day && diff < day * 2) {
                return "yesterday";
            }
      
            if (diff < day * 365) {
                return Math.floor(diff / day) + " days ago";
            }
      
            else {
                return "over a year ago";
            }
        },

        pinHeader: function(){
            //this._$header.addClass('animated fadeOutDown');
            this._$header.addClass('fader');        
        },

        unpinHeader: function(){
            //this._$header.removeClass('animated fadeOutDown');
            this._$header.removeClass('fader');
        },


        initBindings: function(){
            this._$header = $('body>header');
            
            $('ul li a, a').bind('click',function(event){
                var $anchor = $(this);
              
                $('html, body').stop().animate({
                    scrollTop: $($anchor.attr('href')).offset().top -200
                }, 2500,'easeInOutExpo');
                event.preventDefault();
            });
        },

        initHeader: function(){
            //this._$header = $('body>header');
       
            $(document).scroll(
                function(){
                    //console.log($(document).scrollTop());
                    if( $(document).scrollTop() > 20 ){
                        Meeker.pinHeader();
                    }else{
                        Meeker.unpinHeader();
                    }
                }
            );        
        },


        safariFix: function(){
            //fix for safari z-indexing//navbar shitake            
            var header = $('.topBar');
            //console.log(header);
            header.addClass('safariFix');          
        },

        init: function(loaded){
            if(loaded){
                console.log("loaded");
                //Meeker.initPhotos();
            }
            
            else{
                $(document).ready(function() {
                    console.log("ready");                    

                    Meeker.initBindings();
                    Meeker.initHeader();

                    if($.browser.safari){
                        Meeker.safariFix();
                    } 

                    //Meeker.initPhotos();               
                    Meeker.initTwitter("meekr5");

                });
                
                           
                $(window).load(function(){
                    Meeker.init(true);
                });
            }
        }

    };

    Meeker.init();

}(jQuery));

            
        
