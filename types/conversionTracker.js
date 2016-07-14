var Backbone = require('backbone');

var conversionTracker = Backbone.Model.extend({});

var conversionTrackerCollection = Backbone.Collection.extend({
  model: conversionTracker,
});

module.exports = {
  collection: conversionTrackerCollection,
  model: conversionTracker
};
