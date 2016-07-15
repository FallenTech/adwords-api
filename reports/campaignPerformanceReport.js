var
  _ = require('lodash');

var AdWordsReport = require('./adWordsReport');

function Report(options) {
  var self = this;
  self.defaultFieldNames = [
    'Period',
    'UrlCustomParameters',
    'AccountCurrencyCode',
    'AccountDescriptiveName',
    'AccountTimeZoneId',
    'AdNetworkType1',
    'AdNetworkType2',
    'AdvertisingChannelSubType',
    'AdvertisingChannelType',
    'Amount',
    'BiddingStrategyId',
    'BiddingStrategyName',
    'BiddingStrategyType',
    'BidType',
    'BudgetId',
    'CampaignId',
    'CampaignName',
    'CampaignStatus',
    'ClickConversionRate',
    'ConversionRate',
    'Conversions',
    'ConversionValue',
    'ConvertedClicks',
    'Cost',
    'CostPerConversion',
    'CostPerConvertedClick',
    'Ctr',
    'CustomerDescriptiveName',
    'Date',
    'EndDate',
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
    'IsBudgetExplicitlyShared',
    'LabelIds',
    'Labels',
    'Month',
    'MonthOfYear',
    'PrimaryCompanyName',
    'Quarter',
    'ServingStatus',
    'StartDate',
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

  self.reportName = 'Campaign Performance Report';
  self.reportType = 'CAMPAIGN_PERFORMANCE_REPORT';
  AdWordsReport.call(self, options);
}

Report.prototype = _.create(AdWordsReport.prototype, {
  constructor: Report
});

module.exports = Report;
