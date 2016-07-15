var
    _ = require('lodash');

var AdWordsReport = require('./adWordsReport');

function Report(options) {
  var self = this;
  self.defaultFieldNames = [
    'Id',
    'CampaignId',
    'Impressions',
    'AdGroupId',
    'AdGroupName',
    'Clicks',
    'Cost'
  ];

  self.reportName = 'Ad Performance Report';
  self.reportType = 'AD_PERFORMANCE_REPORT';
  AdWordsReport.call(self, options);
}

Report.prototype = _.create(AdWordsReport.prototype, {
  constructor: Report
});

module.exports = Report;