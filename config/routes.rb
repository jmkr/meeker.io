MeekerIo::Application.routes.draw do
  root :to => "home#index"
  resources :users, :only => [:index, :show, :edit, :update ]
  match '/auth/:provider/callback' => 'sessions#create'
  match '/signin' => 'sessions#new', :as => :signin
  match '/signout' => 'sessions#destroy', :as => :signout
  match '/auth/failure' => 'sessions#failure'
  match '/photos' => 'home#photos'
  match '/blog'  => redirect("http://blog.meeker.io"), :as => :blog
  match '/resume' => redirect('https://dl.dropbox.com/u/19475876/MeekerJohn_Resume_v2.pdf'), :as => :resume
end
