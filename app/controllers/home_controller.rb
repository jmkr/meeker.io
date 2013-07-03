class HomeController < ApplicationController
  def index
    @tweet = Tweet.last
    gon.tweet = @tweet
  end
  def photos

  end
  def resume
  	
  end
end
