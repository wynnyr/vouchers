import { Random } from 'meteor/random'

var firstLoad = 0;

Template.qrcodeEdit.onCreated(function() {
   Session.set('qrcodeEditErrors', {});
   Session.set('qrcodeCodeRandom','');
   firstLoad = 0;
});
 
Template.qrcodeEdit.helpers({
  ownCampaign: function() {
    return this.userId === Meteor.userId()
  },

  errorMessage: function(field) {
     return Session.get('qrcodeEditErrors')[field];
  },

  errorClass: function (field) {
     return !!Session.get('qrcodeEditErrors')[field] ? 'has-error' : '';
  },
  codeRandom: function() {
    if(firstLoad==0){
      firstLoad=1;
      Session.set("qrcodeCodeRandom",this.code);
    }
    return Session.get('qrcodeCodeRandom');
  }
});

Template.qrcodeEdit.events({

  'click .randoncode': function() {
    Session.set('qrcodeCodeRandom',Random.id(6));
  },
  
  'submit form': function(e) {
    e.preventDefault();

    var currentQrcodeId = this._id;
    var currentCampaignId = this.campaignId;
    var qrcodeProperties = {
      code: e.target.code.value,
      body: e.target.body.value,
    }

    var errors = validateQrcodeCreate(qrcodeProperties);
    if (errors.code || errors.body){
      return Session.set('qrcodeEditErrors', errors);
    }

    Meteor.call('qrcodeUpdate', currentQrcodeId, qrcodeProperties, function(error, result) {
      if (error){
        return throwError(error.reason);
      }

      if (result.qrcodeExists){
        var errors = {};
        errors.code = 'Code "'+ qrcodeProperties.code + '" has already';
        return Session.set('qrcodeEditErrors', errors);
      }
      Router.go('campaignPage', {_id:currentCampaignId}); 
    });
 
  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this QRcode [" + this.code + "] ?")) {
      var currentQrcodeId     = this._id;
      var currentCampaignId   = this.campaignId;

      Qrcodes.remove(currentQrcodeId);
      Campaigns.update(currentCampaignId, {$inc: {qrcodesCount: -1}}, function(error){
        if (error) {
          return throwError(error.reason);
        }
      });

      Router.go('campaignPage', {_id: currentCampaignId});
    }
  }
});