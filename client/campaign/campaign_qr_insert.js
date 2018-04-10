Template.campaignQRInsert.helpers({
   ownCampaign: function() {
      return ownsDocument(Meteor.userId(),this)
   },
 });