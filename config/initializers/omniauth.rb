Rails.application.config.middleware.use OmniAuth::Builder do
  provider :twitter, ENV['MEEKER_IO_TWITTER_OMNIAUTH_PROV_KEY'], ENV['MEEKER_IO_TWITTER_OMNIAUTH_PROV_SECRET']
end
