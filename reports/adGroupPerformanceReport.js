var
  _ = require('lodash');

var AdWordsReport = require('./adWordsReport');

function Report(options) {
  var self = this;
  self.defaultFieldNames = [
    'UrlCustomParameters',
    'AccountCurrencyCode',
    'AccountDescriptiveName',
    'AccountTimeZoneId',
    'AdGroupId',
    'AdGroupName',
    'AdGroupStatus',
    'AdNetworkType1',
    'AdNetworkType2',
    'BiddingStrategyId',
    'BiddingStrategyName',
    'BiddingStrategyType',
    'BidType',
    'CampaignId',
    'CampaignName',
    'CampaignStatus',
    'ClickConversionRate',
    'ContentBidCriterionTypeGroup',
    'ConversionRate',
    'Conversions',
    'ConversionValue',
    'ConvertedClicks',
    'Cost',
    'CostPerConversion',
    'CostPerConvertedClick',
    'CpcBid',
    'CpmBid',
    'CpvBid',
    'Ctr',
    'CustomerDescriptiveName',
    'Date',
    'DayOfWeek',
    'EngagementRate',
    'Engagements',
    'EnhancedCpcEnabled',
    'EnhancedCpvEnabled',
    'ExternalCustomerId',
    'GmailForwards',
    'GmailSaves',
    'GmailSecondaryClicks',
    'Impressions',
    'InteractionRate',
    'Interactions',
    'LabelIds',
    'Labels',
    'Month',
    'MonthOfYear',
    'PrimaryCompanyName',
    'Quarter',
    'TargetCpa',
    'TrackingUrlTemplate',
    'ValuePerAllConversion',
    'ValuePerConversion',
    'ValuePerConvertedClick',
    'VideoQuartile100Rate',
    'VideoQuartile25Rate',
    'VideoQuartile50Rate',
    'VideoQuartile75Rate',
    'VideoViewRate',
    'VideoViews',
    'ViewThroughConversions',
    'Week',
    'Year'
  ];

  self.reportName = 'Ad Group Performance Report';
  self.reportType = 'ADGROUP_PERFORMANCE_REPORT';
  AdWordsReport.call(self, options);
}

Report.prototype = _.create(AdWordsReport.prototype, {
  'constructor': Report
});

module.exports = (Report);
