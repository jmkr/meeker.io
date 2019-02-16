MeekerIo::Application.routes.draw do
  root :to => "home#index"
  get '/photos' => 'home#photos'
  get '/blog'  => redirect("http://blog.meeker.io"), :as => :blog
  get '/resume' => redirect('https://www.dropbox.com/s/6vpodceec28tgkp/MeekerJohn_Resume_Feb2019.pdf?dl=0'), :as => :resume
end
