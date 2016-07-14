var
  _ = require('lodash');

var AdWordsReport = require('./adWordsReport');

function Report(options) {
  var self = this;
  self.defaultFieldNames = [
    'CampaignId',
    'Query',
    'Impressions',
    'KeywordId',
    'KeywordTextMatchingQuery',
    'AdGroupId',
    'AdGroupName',
    'Clicks',
    'Cost'
  ];

  self.reportName = 'Search Query Performance Report';
  self.reportType = 'SEARCH_QUERY_PERFORMANCE_REPORT';
  AdWordsReport.call(self, options);
}

Report.prototype = _.create(AdWordsReport.prototype, {
  'constructor': Report
});

module.exports = (Report);