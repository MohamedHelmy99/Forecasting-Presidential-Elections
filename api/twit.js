//Importing a Twitter API library.
const Twit = require('twit');

//Importing DOTENV to manage the environment variables.
require('dotenv').config();

//Create a Twit instance that can be used to make requests to Twitter's APIs.
const T = new Twit({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token: process.env.access_token,
    access_token_secret: process.env.access_token_secret, 
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL:            true,     // optional - requires SSL certificates to be valid. 
    
})
T.get('account/verify_credentials', { skip_status: true })
  .catch(function (err) {
    console.log('caught error', err.stack)
  })
  .then(function (result) {

    console.log('data', result.data);
  })
module.exports = T;