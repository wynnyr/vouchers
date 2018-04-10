
Template.qrcodeCreate.onCreated(function() {
   Session.set('qrcodeCreateErrors', {});
});
 
Template.qrcodeCreate.helpers({
  ownCampaign: function() {
    return this.userId === Meteor.userId()
  },

  errorMessage: function(field) {
     return Session.get('qrcodeCreateErrors')[field];
  },

  errorClass: function (field) {
     return !!Session.get('qrcodeCreateErrors')[field] ? 'has-error' : '';
  },
});

Template.qrcodeCreate.events({
   'submit form': function(e) {
      e.preventDefault();

      var currentCampaignId = this._id;

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
        return throwError(error.reason);
      }
  
      if (result.qrcodeExists){
        return throwError('This qrcode has already');
      }

      Router.go('campaignPage', {_id: result.campaignId}); 
        
    });
  }

});