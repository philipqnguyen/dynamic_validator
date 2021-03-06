require 'sinatra'
require 'json'

set :port, 3000

get '/username/?' do
  response['Access-Control-Allow-Origin'] = '*'
  content_type :json
  existing_usernames = ['thunderball', 'kkong', 'ffmegaman']
  if existing_usernames.include? params[:username]
    status 406
    { result: false }.to_json
  else
    { result: true }.to_json
  end
end
