CampaignsListController = RouteController.extend({
  template: 'campaignsList',
  increment: 5, 
  
  campaignsLimit: function() { 
    return parseInt(this.params.campaignsLimit) || this.increment; 
  },
  findOptions: function() {
    return {sort: {submitted: -1}, limit: this.campaignsLimit()};
  },
  subscriptions: function() {
    if(!Meteor.user()){
      this.campaignsSub = 0;
    }
    else{
      var userId = Meteor.userId(); 
      this.campaignsSub = Meteor.subscribe('campaigns', userId, this.findOptions());
    }

  },
  campaigns: function() {
    return Campaigns.find({}, this.findOptions());
  },
  data: function() {
    var hasMore  = this.campaigns().count() === this.campaignsLimit();
    var nextPath = this.route.path({campaignsLimit: this.campaignsLimit() + this.increment});

    return {
      campaigns: this.campaigns(),
      ready: this.campaignsSub.ready,
      nextPath: hasMore ? nextPath : null
    };
   }
});