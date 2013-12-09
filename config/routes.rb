MeekerIo::Application.routes.draw do
  root :to => "home#index"
  match '/photos' => 'home#photos'
  match '/blog'  => redirect("http://blog.meeker.io"), :as => :blog
  match '/resume' => redirect('https://dl.dropboxusercontent.com/u/19475876/MeekerJohn_Resume.pdf'), :as => :resume
end
