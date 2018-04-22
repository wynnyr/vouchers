Template.qrcodeBulk.onCreated(function() {
  Session.set('qrcodeBulkErrors', {});
});

Template.qrcodeBulk.helpers({
  errorMessage: function(field) {
     return Session.get('qrcodeBulkErrors')[field];
  },

  errorClass: function (field) {
     return !!Session.get('qrcodeBulkErrors')[field] ? 'has-error' : '';
  },
});

Template.qrcodeBulk.events({

   'submit form': function(e) {
      e.preventDefault();

      var currentCampaignId = this._id;
      var QRCount = e.target.count.value;
      var QRbody = e.target.body.value;
      
 
      var errors = validateQrcodeBulk(QRCount,QRbody);
      if (errors.count || errors.body){
        return Session.set('qrcodeBulkErrors', errors);
      }

      Meteor.call('qrcodeBulk', currentCampaignId, QRbody, QRCount, function(error, result){
        if (error){
          return throwError(error.reason);
        }

         Router.go('campaignPage', {_id: result.campaignId}); 
      });

   }
 
});