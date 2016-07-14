var
  _ = require('lodash'),
  async = require('async'),
  soap = require('soap');

var AdWordsService = require('./adWordsService');
var types = require('../types/conversionTracker');

function Service(options) {
  var self = this;
  AdWordsService.call(self, options);
  self.Collection = types.collection;
  self.Model = types.model;

  self.parseGetResponse = function(response) {
    if (self.validateOnly) {
      return {
        entries: null
      };
    } else {
      if (response.rval) {
        return {
          entries: new self.Collection(response.rval.entries),
        };
      } else {
        return {};
      }
    }
  };

  self.parseMutateResponse = function(response) {
    if (self.validateOnly) {
      return {
        partialFailureErrors: null,
        value: null
      };
    } else {
      if (response.rval) {
        return {
          partialFailureErrors: response.rval.partialFailureErrors,
          value: new self.Collection(response.rval.value)
        };
      } else {
        return {};
      }
    }
  };

  self.parseQueryResponse = function(response) {
    return self.parseGetResponse(response);
  };

  self.selectable = [
    'AlwaysUseDefaultRevenueValue',
    'AppId',
    'AppPlatform',
    'AppPostbackUrl',
    'BackgroundColor',
    'Category',
    'ConversionPageLanguage',
    'ConversionTypeOwnerCustomerId',
    'CountingType',
    'CtcLookbackWindow',
    'DefaultRevenueCurrencyCode',
    'DefaultRevenueValue',
    'ExcludeFromBidding',
    'Id',
    'LastReceivedRequestTime',
    'MostRecentConversionDate',
    'Name',
    'OriginalConversionTypeId',
    'PhoneCallDuration',
    'Status',
    'TextFormat',
    'TrackingCodeType',
    'ViewthroughLookbackWindow',
    'WebsitePhoneCallDuration',
  ];

  self.xmlns = 'https://adwords.google.com/api/adwords/cm/' + self.version;
  self.wsdlUrl = self.xmlns + '/ConversionTrackerService?wsdl';
}
Service.prototype = _.create(AdWordsService.prototype, {
  'constructor': Service
});

module.exports = (Service);