var
  _ = require('lodash'),
  Backbone = require('backbone'),
  Paging = require('./paging');

var Selector = Backbone.Model.extend({
  defaults: {
    paging: new Paging.model().toJSON()
  },
  /*toJSON: function(options) {
    jsonObj = Backbone.Model.prototype.toJSON.apply(this, arguments);
    jsonObj = 
  }*/
});

var SelectorCollection = Backbone.Collection.extend({
  model: Selector
});

module.exports = {
  collection: SelectorCollection,
  model: Selector
};
