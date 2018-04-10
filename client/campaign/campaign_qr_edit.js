Template.campaignQREdit.helpers({
   ownCampaign: function(campaign) {
      return ownsDocument(Meteor.userId(),campaign)
   },
 });