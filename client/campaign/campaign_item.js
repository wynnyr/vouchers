Template.campaignItem.helpers({
  ownCampaign: function() {
     return this.userId === Meteor.userId();
  },
});