var
    _ = require('lodash');

var AdWordsReport = require('./adWordsReport');

function Report(options) {
  var self = this;
  self.defaultFieldNames = [
    'AccountCurrencyCode',
    'AccountDescriptiveName',
    'AccountTimeZoneId',
    'AdNetworkType1',
    'AdNetworkType2',
    'CanManageClients',
    'ClickConversionRate',
    'Clicks',
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
    'DayOfWeek',
    'Device',
    'EngagementRate',
    'Engagements',
    'ExternalCustomerId',
    'Impressions',
    'InteractionRate',
    'Interactions',
    'IsAutoTaggingEnabled',
    'IsTestAccount',
    'Month',
    'MonthOfYear',
    'PrimaryCompanyName',
    'Quarter',
    'ValuePerAllConversion',
    'ValuePerConversion',
    'ValuePerConvertedClick',
    'VideoViewRate',
    'VideoViews',
    'ViewThroughConversions',
    'Week',
    'Year'
  ];

  self.reportName = 'Account Performance Report';
  self.reportType = 'ACCOUNT_PERFORMANCE_REPORT';
  AdWordsReport.call(self, options);
}

Report.prototype = _.create(AdWordsReport.prototype, {
  constructor: Report
});

module.exports = Report;
