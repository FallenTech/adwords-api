var
    _ = require('lodash'),
    request = require('request');

// Define abstract AdWords object
function AdWordsObject(options) {
  var self = this;

  if (!options) options = {};

  _.defaults(options, {
    ADWORDS_CLIENT_ID: process.env.ADWORDS_CLIENT_ID,
    ADWORDS_CLIENT_CUSTOMER_ID: process.env.ADWORDS_CLIENT_CUSTOMER_ID,
    ADWORDS_DEVELOPER_TOKEN: process.env.ADWORDS_DEVELOPER_TOKEN,
    ADWORDS_REFRESH_TOKEN: process.env.ADWORDS_REFRESH_TOKEN,
    ADWORDS_SECRET: process.env.ADWORDS_SECRET,
    ADWORDS_USER_AGENT: process.env.ADWORDS_USER_AGENT,
    verbose: false
  });
  
  if (
    !options.ADWORDS_CLIENT_ID ||
    
    // !options.ADWORDS_CLIENT_CUSTOMER_ID ||
    !options.ADWORDS_DEVELOPER_TOKEN ||
    !options.ADWORDS_REFRESH_TOKEN ||
    !options.ADWORDS_SECRET ||
    !options.ADWORDS_USER_AGENT
  )
    throw new Error('adwords-api not configured correctly');

  self.options = options;
  self.credentials = null;
  self.tokenUrl = 'https://www.googleapis.com/oauth2/v3/token';
  self.verbose = self.options.verbose;
  self.version = 'v201705';

  self.refresh = function(done) {
    if (self.credentials && Date.now() < self.credentials.expires) { // Current credentials expired?
      // Behave asynchronously
      return setTimeout(function() { done(null); }, 0);
    } else {
      // Discard cached client
      self.client = null;

      var qs = {
        refresh_token: self.options.ADWORDS_REFRESH_TOKEN,
        client_id: self.options.ADWORDS_CLIENT_ID,
        client_secret: self.options.ADWORDS_SECRET,
        grant_type: 'refresh_token'
      };

      request.post(
        {
          qs: qs,
          url: self.tokenUrl
        },
        function(error, response, body) {
          self.credentials = JSON.parse(body);
          self.credentials.issued = Date.now();

          self.credentials.expires = self.credentials.issued -
            self.credentials.expires_in;

          done(error);
        }
      );

      return;
    }
  };

  self.setVerbose = function(flag) {
    self.verbose = flag;
    return self;
  };
}

module.exports = (AdWordsObject);
