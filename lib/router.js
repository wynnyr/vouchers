Router.configure({
  layoutTemplate: 'applayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
});  

Router.route('/create', { 
name: 'campaignCreate',
});

Router.route('/campaigns/:_id/edit', {
name: 'campaignEdit',

//subscriptions: function() {
//  this.campaignsSub = Meteor.subscribe('singleCampaignWithImage', this.params._id)
//},

waitOn: function() { 
  return [
    Meteor.subscribe('singleCampaignWithImage', this.params._id)
  ]
  
},
data: function() { 
  return {
    campaign : Campaigns.findOne(this.params._id),
    campaignImage : CampaignImage.findOne(),
    //ready: this.campaignsSub.ready,
  }

}
});

Router.route('/campaigns/:_id/qrinsert', {
name: 'campaignQRInsert',
waitOn: function() {
  return [
    Meteor.subscribe('singleCampaign', this.params._id)
  ]
},
data: function() { return Campaigns.findOne(this.params._id); }
});

Router.route('/campaigns/:_id/qredit', {
name: 'campaignQREdit',
waitOn: function() {
  return [
    Meteor.subscribe('detailQrcodesFromID',this.params._id),
  ]
},
data: function() { 
  return { 
    qrcode : Qrcodes.findOne({_id: this.params._id}),
    campaign : Campaigns.findOne()
  }
}
});

Router.route('/campaigns/:_id/:qrcodesLimit?', {
name: 'campaignPage'
});

Router.route('/redeem/:qrcode?',{
name: 'redeemItem',
layoutTemplate: 'redeemlayout',

waitOn: function() {
  return [
    Meteor.subscribe('detailQrcodesWithImageFromQR',this.params.qrcode),
  ]
},
data: function() { 
  return { 
    qrcode : Qrcodes.findOne({code: this.params.qrcode}),
    campaign : Campaigns.findOne(),
    campaignImage : CampaignImage.findOne(),
  }
}
});

Router.route('/:campaignsLimit?', {
name: 'campaignsList'
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } 
    else {
      this.render('accessDenied');
    }
  } 
  else {
    this.next();
  }
}

var requireLogin2 = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } 
    else {
      this.render('landing');
    }
  } 
  else {
    this.next();
  }
}


Router.onBeforeAction('dataNotFound', {only: 'redeemItem'});
Router.onBeforeAction('dataNotFound', {only: 'campaignPage'});
Router.onBeforeAction('dataNotFound', {only: 'campaignsList'});

Router.onBeforeAction(requireLogin2, {only: 'campaignsList'});
Router.onBeforeAction(requireLogin, {only: 'campaignCreate'});
Router.onBeforeAction(requireLogin, {only: 'campaignEdit'});
Router.onBeforeAction(requireLogin, {only: 'campaignQRInsert'});
Router.onBeforeAction(requireLogin, {only: 'campaignQREdit'});