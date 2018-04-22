Template.campaignItem.helpers({
  ownCampaign: function() {
     return this.userId === Meteor.userId();
  },
});

Template.campaignItem.events({
  'click .csvExport': function(e) {
    e.preventDefault();
    console.log("csvExport")

  },
});