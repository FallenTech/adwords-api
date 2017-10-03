var
	_ = require('lodash'),
	async = require('async'),
	soap = require('soap');

var AdWordsService = require('./adWordsService');
var types = require('../types/offlineConversionFeed');

function Service(options) {
	var self = this;
	AdWordsService.call(self, options);
	self.Collection = types.collection;
	self.Model = types.model;
	//self.operatorKey = 'cm:operator';
	
	self.parseGetResponse = function(response) {
		if (self.validateOnly) {
			return {
				labels: null
			};
		} else if (response.rval) {
			return {
				labels: response.rval.labels || [],
			};
		} else {
			return {};
		}
	};
	
	self.parseMutateResponse = function(response) {
		return self.parseGetResponse(response);
	};
	
	self.mutateAddList = function(clientCustomerId, operand, done) {
		var operands = operand.map(function (operand) {
			if (!operand.isValid()) return done(operand.validationError);
			var operation = {};
			operation[self.operatorKey] = 'ADD';
			operation.operand = operand;
			return operation;
		});
		
		self.mutate(
			{
				clientCustomerId: clientCustomerId,
				mutateMethod: 'mutate',
				operations: operands,
				parseMethod: self.mutateAddListResponse
			},
			done
		);
	};
	
	self.mutateAddListResponse = function(response) {
		if (self.validateOnly) {
			return {
				links: null
			};
		} else if (response.rval) {
			return {
				links: response.rval.links || []
			};
		} else {
			return {};
		}
	};
	
	// https://developers.google.com/adwords/api/docs/reference/v201607/OfflineConversionFeedService.OfflineConversionFeed
	self.selectable = [
		'googleClickId',
		'conversionName',
		'conversionTime',
		'conversionValue',
		'conversionCurrencyCode'
	];
	
	self.xmlns = 'https://adwords.google.com/api/adwords/cm/' + self.version;
	self.wsdlUrl = self.xmlns + '/OfflineConversionFeedService?wsdl';
}

Service.prototype = _.create(AdWordsService.prototype, {
	constructor: Service
});

module.exports = Service;
