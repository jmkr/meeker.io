class Tweet
  include Mongoid::Document
  field :created, type: DateTime
  field :content, type: String

  MY_SCREEN_NAME = "meekr5"
  
  # Connect to Twitter API and fetch the latest tweets 20 tweets.
  def self.get_latest
    tweets = client.statuses.user_timeline? :screen_name => MY_SCREEN_NAME
    tweets.each do |t|
      created = DateTime.parse(t.created_at)
      
      # Create and save the tweet if it doesn't already exist.
      unless Tweet.where(created: created).exists?
        tweet = Tweet.create(:content => t.text, :created => created)
        tweet.save
       end
    end
  end
  
  private

  def self.client
    if !Rails.env.production?
      Grackle::Transport.ca_cert_file = "../assets/cacerts.pem"
    end
    Grackle::Client.new(:auth=>{
      :type=>:oauth,
      :consumer_key=>ENV["TWITTER_CONSUMER_KEY"],
      :consumer_secret=>ENV["TWITTER_CONSUMER_SECRET_KEY"],
      :token=>ENV["TWITTER_ACCESS_TOKEN"],
      :token_secret=>ENV["TWITTER_ACCESS_TOKEN_SECRET"]
    }, :ssl=> true)
  end
end