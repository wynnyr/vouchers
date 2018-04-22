Template.campaignQRBulk.helpers({
   ownCampaign: function(campaign) {
     if(!campaign)
       return 0;
     return ownsDocument(Meteor.userId(),campaign)
   },
 });