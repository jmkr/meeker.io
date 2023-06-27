Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html  
  root :to => "home#index"
  get '/resume' => redirect('https://www.dropbox.com/s/l0icyfe4m3yx06c/MeekerJohn_Resume_Feb2022.pdf?dl=0'), :as => :resume
end
