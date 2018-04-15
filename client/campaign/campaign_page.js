Template.campaignPage.helpers({
   ownCampaign: function(campaign) {
      return ownsDocument(Meteor.userId(),campaign)
    },
 });