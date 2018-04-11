Template.redeemItem.onCreated(function() {
   Session.set('redeemItemError', {});
 });

 Template.redeemItem.helpers({
  errorMessage: function(field) {
    return Session.get('redeemItemError')[field];
  },
  errorClass: function (field) {
    return !!Session.get('redeemItemError')[field] ? 'has-error' : '';
  },
  dateend : function(date) {
    return moment(date).format("LL");
  },
  imageSoure : function(ptrImage) {
		if (!ptrImage)
			return  '<img id="photopreview"/>' ;
		
		var blob = new Blob( [ ptrImage.data ], { type: "image/jpeg" } );
		var urlCreator = window.URL || window.webkitURL;
		var imageUrl = urlCreator.createObjectURL( blob );

    return '<img id="photopreview" src = " '+imageUrl+ ' " style = "display:block; width:100%;height:Auto;" />'
  },
  canRedeem: function() {
    return ((this.campaign.redeemtype === 'unique' && this.qrcode.redeem > 0) || this.expired == 1)
  },
  laseRedeem: function() {
    return moment(this.qrcode.redeemed).format("LL");;
  }
});

Template.redeemItem.events({
  'click .redeemshow': function() {
      var shopcode = prompt("Add Shopcode","");
  },


  'submit form': function(e,template) {
      e.preventDefault();

      var qrcodeProperties = {
        qrcodeId:   template.data.qrcode._id,
        campaignId: template.data.qrcode.campaignId,
        shopcode: $(e.target).find('[name=shopcode]').val(),
      }

      var errors = validateQrcode(qrcodeProperties);
      if (errors.shopcode)
          return Session.set('redeemItemError', errors);
          
      Meteor.call('qrcodeRedeem', qrcodeProperties, function(error, result) {

        //display the error to the user and abort
        if (error){
          return throwError(error.reason);
        }

        if (result.qrcodeNotFound){
          return throwError('This voucher not found.');
        }
        
        if (result.qrcodeRedeemed){
          return throwError('This voucher has been already redeemed.');
        }

        if (result.qrcodeExpired){
          return throwError('This voucher Expired.');
        }

        if (result.qrcodeShopCodeFail){
          return throwError('Invalid merchant');
        }

        if (result.OK){
          //Router.go('redeemOK'); 
          return;
        }
    });
  }
});
