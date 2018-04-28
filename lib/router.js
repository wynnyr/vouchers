Router.configure({
  layoutTemplate: 'applayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound2',
});  


Router.route('/create', { 
  name: 'campaignCreate',
});


Router.route('/campaign/:_id/edit', {
  name: 'campaignEdit',
});

Router.route('/campaign/:_id/qrmassgen', {
  name: 'campaignQRBulk',

  subscriptions: function() {
    var userId = 0;
    if(Meteor.user()){
      userId = Meteor.userId()
    }

    this.campaignsSub = Meteor.subscribe('singleCampaign', this.params._id, userId)
  },
  data: function() { 
    return{
      campaign : Campaigns.findOne(this.params._id),
      ready: this.campaignsSub.ready,
    }
  }
});

Router.route('/campaign/:_id/qrimport', {
  name: 'campaignQRImport',

  subscriptions: function() {
    var userId = 0;
    if(Meteor.user()){
      userId = Meteor.userId()
    }

    this.campaignsSub = Meteor.subscribe('singleCampaign', this.params._id, userId)
  },
  data: function() { 
    return{
      campaign : Campaigns.findOne(this.params._id),
      ready: this.campaignsSub.ready,
    }
  }
});

Router.route('/campaign/:_id/qrinsert', {
  name: 'campaignQRInsert',

  subscriptions: function() {
    var userId = 0;
    if(Meteor.user()){
      userId = Meteor.userId()
    }

    this.campaignsSub = Meteor.subscribe('singleCampaign', this.params._id, userId)
  },
  data: function() { 
    return{
      campaign : Campaigns.findOne(this.params._id),
      ready: this.campaignsSub.ready,
    }
  }
});

Router.route('/campaign/qr/:_id/qredit', {
  name: 'campaignQREdit',
  
  subscriptions: function() {
    var userId = 0;
    if(Meteor.user()){
      userId = Meteor.userId()
    }
    
    this.qrcodeSub = Meteor.subscribe('detailQrcodesFromID', this.params._id, userId);
  },
  data: function() { 
    return { 
      qrcode : Qrcodes.findOne({_id: this.params._id}),
      campaign : Campaigns.findOne(),
      ready: this.qrcodeSub.ready
    }
  }
});


Router.route('/campaign/:_id/:qrcodesLimit?', {
  name: 'campaignPage'
});

Router.route('/redeem/:qrcode?',{
  name: 'redeemItem'
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

Router.onBeforeAction(requireLogin2, {only: 'campaignsList'});
Router.onBeforeAction(requireLogin, {only: 'campaignCreate'});
Router.onBeforeAction(requireLogin, {only: 'campaignEdit'});
Router.onBeforeAction(requireLogin, {only: 'campaignQRInsert'});
Router.onBeforeAction(requireLogin, {only: 'campaignQREdit'});
Router.onBeforeAction(requireLogin, {only: 'campaignPage'});

Router.onBeforeAction('dataNotFound', {only: 'redeemItem'});
//Router.onBeforeAction('dataNotFound', {only: 'campaignPage'});






