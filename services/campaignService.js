var
  _ = require('lodash'),
  async = require('async'),
  soap = require('soap');

var AdWordsService = require('./adWordsService');
var types = require('../types/campaign');

function Service(options) {
  var self = this;
  AdWordsService.call(self, options);
  self.Collection = types.collection;
  self.Model = types.model;

  self.mutateRemove = function(clientCustomerId, operand, done) {
    // CampaignOperation does not support the REMOVE operator. To remove a
    // campaign, set its status to REMOVED

    operand.set('status', 'REMOVED');
    self.mutateSet(clientCustomerId, operand, done);
    return;
  };

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
    'Id',
    'Name',
    'Status',
    'ServingStatus',
    'StartDate',
    'EndDate',
    
    // Budget
    'BudgetId',
    'BudgetName',
    'Amount',
    'DeliveryMethod',
    'BudgetReferenceCount',
    'IsBudgetExplicitlyShared',
    'BudgetStatus',
    
    // ConversionOptimizerEligibility
    'Eligible',
    'RejectionReasons',
    
    'AdServingOptimizationStatus',
    
    // FrequencyCap
    'FrequencyCapMaxImpressions',
    'TimeUnit',
    'Level',
    
    'Settings',
    'AdvertisingChannelType',
    'AdvertisingChannelSubType',
    
    // NetworkSetting
    'TargetGoogleSearch',
    'TargetSearchNetwork',
    'TargetContentNetwork',
    'TargetPartnerSearchNetwork',
    
    'Labels',
    
    // BiddingStrategyConfiguration
    'BiddingStrategyId',
    'BiddingStrategyName',
    'BiddingStrategyType',
    
    'CampaignTrialType',
    'BaseCampaignId',
    'TrackingUrlTemplate',
    'UrlCustomParameters'
  ];

  self.xmlns = 'https://adwords.google.com/api/adwords/cm/' + self.version;
  self.wsdlUrl = self.xmlns + '/CampaignService?wsdl';
}

Service.prototype = _.create(AdWordsService.prototype, {
  'constructor': Service
});

module.exports = (Service);
