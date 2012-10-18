class HomeController < ApplicationController
  def index
    @users = User.all
  end
  def photos

  end
end
