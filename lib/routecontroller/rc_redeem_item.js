RedeemItemController = RouteController.extend({
   template: 'redeemItem',
   layoutTemplate: 'redeemlayout',

   //waitOn: function() {
   //   return [
   //      Meteor.subscribe('detailQrcodesWithImageFromQR',this.params.qrcode),
   //   ]
   //},
   subscriptions: function() {
      this.qrcodeSub = Meteor.subscribe('detailQrcodesWithImageFromQR',this.params.qrcode)
   },
   qrcode: function() {
      return Qrcodes.findOne({code: this.params.qrcode})
   },
   campaign: function() {
      return Campaigns.findOne()
   },
   campaignImage: function() {
      return CampaignImage.findOne()
   },
   dateExpired: function() {
      if (!this.qrcode() || !this.campaign()) {
         return 1;
      }

      var now     =  new Date();
      var nowInt  =  new Date(now).getTime();
      var campaign = this.campaign();

      var campaignStart = new Date(campaign.startdate).getTime();
      var campaignEnd   = new Date(campaign.enddate).getTime();
      if ( nowInt < campaignStart || nowInt > campaignEnd){
         return 1;
      }
      return 0;
   },
   data: function() {
      return {
         qrcode : this.qrcode(),
         campaign : this.campaign(),
         campaignImage : this.campaignImage(),
         expired: this.dateExpired(),
         ready: this.qrcodeSub.ready,
      };
   }
});