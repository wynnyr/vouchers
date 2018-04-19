CampaignEditController = RouteController.extend({
   template: 'campaignEdit',

   subscriptions: function() {
      var userId = 0;
      if(Meteor.user()){
         userId = Meteor.userId()
      }
         
      this.campaignsSub = Meteor.subscribe('singleCampaignWithImage', this.params._id, userId)
   },
   data: function() { 
      return {
         campaign : Campaigns.findOne(this.params._id),
         campaignImage : CampaignImage.findOne(),
         ready: this.campaignsSub.ready,
      }
   }

});