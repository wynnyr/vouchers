Template.qrcodeEdit.onCreated(function() {
   Session.set('qrcodeEditErrors', {});
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
});

Template.qrcodeEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentQrcodeId   = this._id;

    var qrcodeProperties = {
      code: e.target.code.value,
      body: e.target.body.value,
    }

    var errors = validateQrcodeCreate(qrcodeProperties);
    if (errors.code || errors.body){
      return Session.set('qrcodeEditErrors', errors);
    }

    Qrcodes.update(currentQrcodeId, {$set: qrcodeProperties}, function(error) {
      if (error) {
        return throwError(error.reason);
      }
    });

    Router.go('campaignPage', {_id: this.campaignId}); 
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