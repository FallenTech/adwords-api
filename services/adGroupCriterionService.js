var
    _ = require('lodash'),
    async = require('async'),
    soap = require('soap');

var AdWordsService = require('./adWordsService');
var types = require('../types/adGroupCriterion');

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
    } else if (response.rval) {
      return {
        entries: response.rval.entries || [],
      };
    } else {
      return {};
    }
  };

  self.parseMutateResponse = function(response) {
    if (self.validateOnly) {
      return {
        partialFailureErrors: null,
        value: null
      };
    } else if (response.rval) {
      return {
        partialFailureErrors: response.rval.partialFailureErrors,
        value: response.rval.value || []
      };
    } else {
      return {};
    }
  };

  self.parseQueryResponse = function(response) {
    return self.parseGetResponse(response);
  };

  self.selectable = [
    'ActiveViewCpmEnabled',
    'AdGroupId',
    'AgeRangeType',
    'AppId',
    'AppPaymentModelType',
    'ApprovalStatus',
    'BidModifier',
    'BidType',
    'BiddingStrategyId',
    'BiddingStrategyName',
    'BiddingStrategySource',
    'BiddingStrategyType',
    'CaseValue',
    'ChannelId',
    'ChannelName',
    'CpcBid',
    'CpcBidSource',
    'CpmBid',
    'CpmBidSource',
    'CriteriaCoverage',
    'CriteriaSamples',
    'CriteriaType',
    'CriterionUse',
    'DestinationUrl',
    'DisapprovalReasons',
    'DisplayName',
    'EnhancedCpcEnabled',
    'ExperimentBidMultiplier',
    'ExperimentDataStatus',
    'ExperimentDeltaStatus',
    'ExperimentId',
    'FinalAppUrls',
    'FinalMobileUrls',
    'FinalUrls',
    'FirstPageCpc',
    'GenderType',
    'Id',
    'KeywordMatchType',
    'KeywordText',
    'Labels',
    'MobileAppCategoryId',
    'Parameter',
    'ParentCriterionId',
    'PartitionType',
    'Path',
    'PlacementUrl',
    'QualityScore',
    'Status',
    'SystemServingStatus',
    'TopOfPageCpc',
    'TrackingUrlTemplate',
    'UrlCustomParameters',
    'UserInterestId',
    'UserInterestName',
    'UserInterestParentId',
    'UserListId',
    'UserListMembershipStatus',
    'UserListName',
    'VerticalId',
    'VerticalParentId',
    'VideoId',
    'VideoName'
  ];

  self.xmlns = 'https://adwords.google.com/api/adwords/cm/' + self.version;
  self.wsdlUrl = self.xmlns + '/AdGroupCriterionService?wsdl';
}

Service.prototype = _.create(AdWordsService.prototype, {
  constructor: Service
});

module.exports = Service;
