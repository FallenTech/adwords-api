var
    _ = require('lodash'),
    async = require('async'),
    soap = require('soap');

var AdWordsService = require('./adWordsService');
var types = require('../types/customerService');

function Service(options) {
  var self = this;
  AdWordsService.call(self, options);
  self.Collection = types.collection;
  self.Model = types.model;

  self.parseGetResponse = function(response) {
    if (self.validateOnly) {
      return null;
    } else if (response.rval) {
      return response.rval;
    } else {
      return {};
    }
  };
  
  self.getCustomers = function(done) {
    delete self.soapHeader.RequestHeader.clientCustomerId;
    async.waterfall([
      // get client
      self.getClient,
      
      // Request AdWords data...
      function(client, cb) {
        if (self.methods.indexOf('getCustomers') === -1) {
          return done(new Error('getCustomers method does not exist on ' + self.name));
        }

        self.client.addSoapHeader(self.soapHeader, self.name, self.namespace, self.xmlns);
        self.client.setSecurity(new soap.BearerSecurity(self.credentials.access_token));
        self.client.getCustomers(cb);
      }
    ],
    function(err, response) {
      if (err) err = self.parseErrorResponse(err);
      return done(err, self.parseGetResponse(response));
    });
  };

  self.parseQueryResponse = function(response) {
    return self.parseGetResponse(response);
  };

  self.selectable = [
    'customerId',
    'currencyCode',
    'dateTimeZone',
    'descriptiveName',
    'companyName',
    'canManageClients',
    'testAccount',
    'autoTaggingEnabled',
    'conversionTrackingSettings',
    'remarketingSettings'
  ];

  self.xmlns = 'https://adwords.google.com/api/adwords/mcm/' + self.version;
  self.wsdlUrl = self.xmlns + '/CustomerService?wsdl';
}

Service.prototype = _.create(AdWordsService.prototype, {
  constructor: Service
});

module.exports = Service;