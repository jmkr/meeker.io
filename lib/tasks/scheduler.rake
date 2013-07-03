desc "This task is called by the Heroku scheduler addon update tweets"
task :update_tweets => :environment do
  puts "Updating feed..."
  Tweet.get_latest
  puts "done."
end