MeekerIo::Application.routes.draw do
  root :to => "home#index"
  get '/photos' => 'home#photos'
  get '/blog'  => redirect("http://blog.meeker.io"), :as => :blog
  get '/resume' => redirect('https://www.dropbox.com/s/mrziq5aovqfgimr/MeekerJohn_Resume_Dec2018.pdf?dl=0'), :as => :resume
end
