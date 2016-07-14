var Backbone = require('backbone');
var CampaignExtensionSetting = Backbone.Model.extend({});

var CampaignExtensionSettingCollection = Backbone.Collection.extend({
  model: CampaignExtensionSetting
});

module.exports = {
  collection: CampaignExtensionSettingCollection,
  model: CampaignExtensionSetting
};