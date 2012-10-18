(function($){

    var Meeker = {
        $_header: null,
        $_safari: null,
        
        setTweet: function(tweet, tweetTime){
            console.log(tweet);
            $("#tweets").html(tweet);
            //tweet = tweet.html_safe();
            //console.log(tweet);
            //$("#tweet").html('<%= raw ' +tweet +' %>');    


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
                //console.log(data.length + " twit");
                //for (i = 0; i < data.length; i++) {
                    tweet += data[0].text;
                    tweetTime += data[0].created_at;
                //}    

                tweet = Meeker.formatTweet(tweet);                      
                tweetTime = Meeker.timeAgo(tweetTime);
                Meeker.setTweet(tweet, tweetTime);
            });
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
                    url = '@<a href="http://twitter.com/' + username + '">' + username + '</a>';
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
                console.log("not ready");
                setTimeout(function(){Meeker.initPhotos()},100);
            }else{
                $(".photo-feed").show();
                Meeker.showPhotos(0, imgs);
            }
        },

        showPhotos: function(i, imgs){                
                //console.log(i);
                //console.log(imgs.eq(i));
                //escape on last image
                if(i >= imgs.size()){ return; }                
                
                // Apply top bounce-in class to odd rows and bottom bounce-in to even rows
                if((Math.ceil((i+1)/4))%2 == 1)
                {
                    imgs.eq(i).addClass('bounceTop'+((i%4)+1));
                } else {
                    imgs.eq(i).addClass('bounceBottom'+((i%4)+1));
                }

                imgs.eq(i).fadeIn(150, function(){ Meeker.showPhotos(i+1, imgs); });
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
            this._$header = $('.topBar');
            //console.log(this._$header);
            
            $('ul li a, a').bind('click',function(event){
                var $anchor = $(this);
              
                $('html, body').stop().animate({
                    scrollTop: $($anchor.attr('href')).offset().top -375
                }, 2500,'easeInOutExpo');
                event.preventDefault();
            });
        },

        initHeader: function(){
            //this._$header = $('body>header');
       
            $(document).scroll(
                function(){
                    //console.log($(document).scrollTop());
                    if(this._$needsFixin){
                        if( $(document).scrollTop() > 700 ){
                            Meeker.pinSafariFix();
                        }else{
                            Meeker.unpinSafariFix();
                        }
                    }

                    if( $(document).scrollTop() > 20 ){
                        Meeker.pinHeader();
                    }else{
                        Meeker.unpinHeader();
                    }
                }
            );        
        },

        initTyper: function(){
            setTimeout(function() {
                $('[data-typer-targets]').typer();    
            }, 7500);
        },

        pinSafariFix: function(){
            //fix for safari z-indexing//navbar shitake            
            this._$header.addClass('safariFix');          
        },

        unpinSafariFix: function(){
            //fix for safari z-indexing//navbar shitake            
            this._$header.removeClass('safariFix');          
        },

        init: function(loaded){
            if(loaded){
                //console.log("loaded");
                if(window.location.pathname == "/photos"){
                    Meeker.initPhotos();
                }
            }
            
            else{
                $(document).ready(function() {
                    //console.log("ready");                    

                    Meeker.initBindings();
                    Meeker.initHeader();
                    Meeker.initTyper();

                    if($.browser.safari /*|| $.browser.chrome*/){
                        this._$needsFixin = true;
                    } 

                    //Meeker.initPhotos(); 
                    if(window.location.pathname == "/"){              
                        Meeker.initTwitter("meekr5");
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

            
        
