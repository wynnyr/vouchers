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
          return Bert.alert( error.reason, 'danger', 'growl-top-right' );
        }

        if(result.qrcodeGen == QRCount){
          Bert.alert( 'Generate '+QRCount+' Qrcode Complete', 'success', 'growl-top-right' );
        }
        else{
          Bert.alert( 'Generate Fail '+ (QRCount-result.qrcodeGen) + ' from target'+ QRCount+' Qrcode', 'warning', 'growl-top-right' );
        }

        Router.go('campaignPage', {_id: result.campaignId}); 
      });

   }
 
});