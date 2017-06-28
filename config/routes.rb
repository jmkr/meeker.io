MeekerIo::Application.routes.draw do
  root :to => "home#index"
  get '/photos' => 'home#photos'
  get '/blog'  => redirect("http://blog.meeker.io"), :as => :blog
  get '/resume' => redirect('https://www.dropbox.com/s/9czsjl27yy3sogm/MeekerJohn_Resume_June2017v2.pdf?dl=0'), :as => :resume
end
