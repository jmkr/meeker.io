desc "This task is called by the Heroku scheduler addon to update tweets"
task :update_tweets => :environment do
  puts "Updating tweets..."
  Tweet.get_latest
  puts "done."
end