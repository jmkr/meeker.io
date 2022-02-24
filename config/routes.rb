MeekerIo::Application.routes.draw do
  root :to => "home#index"
  get '/resume' => redirect('https://www.dropbox.com/s/6vpodceec28tgkp/MeekerJohn_Resume_Feb2019.pdf?dl=0'), :as => :resume
end
