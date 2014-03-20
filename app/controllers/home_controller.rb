class HomeController < ApplicationController
  def index
    @tweet = Tweet.order_by([[:created, :desc]]).limit(1).first
    gon.tweet = @tweet
  end
  def photos

  end
  def resume
  	
  end
end
