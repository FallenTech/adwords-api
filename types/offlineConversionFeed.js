var _        = require('lodash'),
	Backbone = require('backbone');


var conversionTimeR         = new RegExp('[0-9]{8} [0-9]{6} [a-zA-Z\/]{2,30}'),
//var conversionTimeR         = new RegExp('[0-9]{2}/[0-9]{2}/[0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2} [a-zA-Z\/]{2,30}'),
	conversionCurrencyCodeR = new RegExp('[A-Z]{2,10}');


var AccountLabel = Backbone.Model.extend({
	validate: function(attrs, options) {
		var validationErrors = [];
		
		if ( ! attrs.googleClickId || attrs.googleClickId.length == 0                 ) validationErrors.push(Error('googleClickId is empty'));
		if ( ! attrs.googleClickId || attrs.googleClickId.length == 0                 ) validationErrors.push(Error('conversionName is empty'));
		if ( ! (attrs.conversionTime && attrs.conversionTime.match(conversionTimeR))  ) validationErrors.push(Error('conversionTime is invalid'));
		if (attrs.conversionValue && _.isNumber(attrs.conversionValue) === false      ) validationErrors.push(Error('conversionValue is invalid'));
		if (attrs.conversionCurrencyCode && attrs.conversionCurrencyCode.match(conversionCurrencyCodeR) === null ) validationErrors.push(Error('conversionCurrencyCode is invalid'));
		
		if (validationErrors.length > 0) return validationErrors;
	}
});


var AccountLabelCollection = Backbone.Collection.extend({
	model: AccountLabel
});


module.exports = {
	collection: AccountLabelCollection,
	model: AccountLabel
};
