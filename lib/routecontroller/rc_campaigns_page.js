CampaignPageController = RouteController.extend({
  template: 'campaignPage',
  increment: 5,
   
  qrcodesLimit: function() { 
    return parseInt(this.params.qrcodesLimit) || this.increment; 
  },
  findOptions: function() {
    return {sort: {submitted: -1}, limit: this.qrcodesLimit()};
  },
  subscriptions: function() {
    var userId = 0;
    if(Meteor.user()){
      userId = Meteor.userId()
    }

    this.campaignsSub = Meteor.subscribe('singleCampaign', this.params._id, userId);
    this.qrcodeSub    = Meteor.subscribe('qrcodes', this.params._id, userId, this.findOptions());
    
  },
  campaign: function() {
    return Campaigns.findOne(this.params._id);
  },
  qrcodes: function() {
    return Qrcodes.find({campaignId: this.params._id},this.findOptions());
  },
  data: function() {
    var hasMore  = this.qrcodes().count() === this.qrcodesLimit();
    var nextPath = this.route.path({_id: this.params._id, qrcodesLimit: this.qrcodesLimit() + this.increment});
    return {
      campaign: this.campaign(),
      qrcodes : this.qrcodes(),
      ready: (this.qrcodeSub.ready && this.campaignsSub.ready),
      //ready: 0,
      nextPath: hasMore ? nextPath : null
    }
  }
});
