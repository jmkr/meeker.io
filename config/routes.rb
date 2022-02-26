MeekerIo::Application.routes.draw do
  root :to => "home#index"
  get '/resume' => redirect('https://www.dropbox.com/s/l0icyfe4m3yx06c/MeekerJohn_Resume_Feb2022.pdf?dl=0'), :as => :resume
end
