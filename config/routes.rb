MeekerIo::Application.routes.draw do
  root :to => "home#index"
  get '/photos' => 'home#photos'
  get '/blog'  => redirect("http://blog.meeker.io"), :as => :blog
  get '/resume' => redirect('https://dl.dropboxusercontent.com/u/19475876/MeekerJohn_Resume.pdf'), :as => :resume
end
