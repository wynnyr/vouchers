Template.redeemItem.onCreated(function() {
   Session.set('redeemItemError', {});
   Session.set('redeemItemSuccess', 0);
   Session.set('redeemItemFailure', 0);
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
  successRedeem: function() {
    return Session.get('redeemItemSuccess');
  },

  failureRedeem: function() {
    return Session.get('redeemItemFailure');
  },

  isRedeemed: function() {
    if(!isQRcode(this.campaign,this.qrcode)){
      return 1; 
    }
    else if(((this.campaign.redeemtype === 'unique' && this.qrcode.redeem > 0) || this.expired == 1)){
      return 1;
    }
    else{
      return 0;
    }
  },

  laseRedeem: function() {
    if(!isQRcode(this.campaign,this.qrcode)){
      return ""; 
    }
    return moment(this.qrcode.redeemed).format("LL");;
  }
});

Template.redeemItem.events({
  /*
  'click .redeemshow': function() {
    $(".redeemContent").css('display', 'none');
    $(".redeemForm").css('display', 'block');
  },

  'click .redeemhide': function() {
      $(".redeemContent").css('display', 'block');
      $(".redeemForm").css('display', 'none');
  },
*/


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

      $('#shopcodemodel').modal('hide')    
      
      Meteor.call('qrcodeRedeem', qrcodeProperties, function(error, result) {

        //display the error to the user and abort
        if (error){
          //return throwError(error.reason);
          return;
        }

        if (result.qrcodeNotFound){
          //return throwError('This voucher not found.');
          return;
        }
        
        if (result.qrcodeRedeemed){
          //return throwError('This voucher has been already redeemed.');
          return;
        }

        if (result.qrcodeExpired){
          //return throwError('This voucher Expired.');
          return;
        }

        if (result.qrcodeShopCodeFail){
          Session.set('redeemItemFailure', '1');
          //return throwError('Invalid merchant');
          return;
        }

        if (result.qrcodeRedeemSuccess){
          Session.set('redeemItemSuccess', '1');
          return;
        }
    });
  }
});


