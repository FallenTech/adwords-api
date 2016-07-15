var
  _ = require('lodash');

var AdWordsReport = require('./adWordsReport');

function Report(options) {
  var self = this;
  self.defaultFieldNames = [
    'CampaignId',
    'Impressions',
    'Id',
    'AdGroupId',
    'AdGroupName',
    'Clicks',
    'Cost'
  ];

  self.reportName = 'Display Keyword Performance Report';
  self.reportType = 'DISPLAY_KEYWORD_PERFORMANCE_REPORT';
  AdWordsReport.call(self, options);
}

Report.prototype = _.create(AdWordsReport.prototype, {
  constructor: Report
});

module.exports = Report;