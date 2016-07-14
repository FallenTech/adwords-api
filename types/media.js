var Backbone = require('backbone');

var Media = Backbone.Model.extend({});

var MediaCollection = Backbone.Collection.extend({
  model: Media
});

module.exports = {
  collection: MediaCollection,
  model: Media
};
