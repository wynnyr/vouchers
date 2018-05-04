
import { Random } from 'meteor/random'

Template.qrcodeCreate.onCreated(function() {
   Session.set('qrcodeCreateErrors', {});
   Session.set('qrcodeCodeRandom',Random.id(6));
});
 
Template.qrcodeCreate.helpers({
  errorMessage: function(field) {
     return Session.get('qrcodeCreateErrors')[field];
  },

  errorClass: function (field) {
     return !!Session.get('qrcodeCreateErrors')[field] ? 'has-error' : '';
  },
  codeRandom: function() {
    return Session.get('qrcodeCodeRandom');
  }
});

Template.qrcodeCreate.events({
  'click .randoncode': function() {
    Session.set('qrcodeCreateErrors', {});
    Session.set('qrcodeCodeRandom',Random.id(6));
  },
  
  'submit form': function(e) {
    e.preventDefault();

    var currentCampaignId = this._id;
    var currentCampaignTitle = this.title;

    var qrcodeProperties = {
      campaignId : currentCampaignId,
      code: e.target.code.value,
      body: e.target.body.value,
    }

    var errors = validateQrcodeCreate(qrcodeProperties);
    if (errors.code || errors.body){
      return Session.set('qrcodeCreateErrors', errors);
    }

    Meteor.call('qrcodeInsert', qrcodeProperties, function(error, result) { 
      if (error){
        return Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
  
      if (result.qrcodeExists){
        errors.code = 'Code "'+ qrcodeProperties.code + '" has already';
        return Session.set('qrcodeCreateErrors', errors);
      }

      Bert.alert( 'Add Qrcode "'+qrcodeProperties.code +'" to Campaign', 'success', 'growl-top-right' );
      Router.go('campaignPage', {_id: result.campaignId}); 
        
    });
  }

});