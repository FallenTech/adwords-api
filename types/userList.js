var Backbone = require('backbone');

var UserListCriterion = Backbone.Model.extend({});

var UserListCollection = Backbone.Collection.extend({
  model: UserListCriterion,
});

module.exports = {
  collection: UserListCollection,
  model: UserListCriterion
};
