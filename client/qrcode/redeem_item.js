var firstLoad=0
Template.redeemItem.onCreated(function() {
   Session.set('redeemItemError', {});
   Session.set('redeemItemSuccess', 0);
   Session.set('redeemItemFailure', 0);
   Session.set('redeemSecretCode', '');
   Session.set('redeemBarcode', '');
   firstLoad = 0;
 });

 Template.redeemItem.helpers({
  incView: function() {
    $(document).attr("title", this.campaign.title);
    //console.log('insView->m='+this.mode);
    if (firstLoad == 0 && this.mode != 'preview'){
      firstLoad = 1;
      Meteor.call('qrViewCount', this.campaign._id,this.qrcode._id, function(error, result) {
        if (error){
          return;
        }
      })
    }
  },
  

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
    $("#favicon").attr("href",imageUrl);
    return '<img id="photopreview" src = " '+imageUrl+ ' " style = "display:block; width:100%;height:Auto;" />'
  },

  redeemStatus: function() {
    if(!isQRcode(this.campaign,this.qrcode))
      return Spacebars.SafeString('<div class = "redeemed-failure"> <h1>Non-Existing Voucher.</h1><div>The Voucher with the code does not exist.</div>')
    else{
      var lastRedeem  = moment(this.qrcode.redeemed).format("LL");
      var endCampaign = moment(this.campaign.enddate).format("LL");
      if (Session.get('redeemItemSuccess')){
        if(this.campaign.showSecretCode)
        {
          return Spacebars.SafeString('<div class = "redeemed-success"> <h1>The coupon was redeemed.</h1><div>'+ lastRedeem +'</div></div> <div class="redeemstatus-secretcode"> <h1>Secret Code</h1><div>'+ Session.get('redeemSecretCode')+'</div></div>')
        }else
        {
          return Spacebars.SafeString('<div class = "redeemed-success"> <h1>The coupon was redeemed.</h1><div>'+ lastRedeem +'</div></div> <div class="redeemstatus-secretcode"> </div>')
 
        }
      }
      else if (Session.get('redeemItemFailure')){
        return Spacebars.SafeString('<div class = "redeemed-failure"> <h1>Invalid merchant.</h1>')
      }
      if(this.expired){
        return Spacebars.SafeString('<div class = "redeemed-failure"> <h1>Voucher expired.</h1><div>'+ endCampaign +'</div>');
      }
      else if((this.campaign.redeemtype === 'unique') && (this.qrcode.redeem > 0)){
        return Spacebars.SafeString('<div class = "redeemed-failure"> <h1>This voucher has been already redeemed.</h1><div>'+ lastRedeem +'</div>')
      }
      else{
        return ''
      }
    }
  },

  campaignBarcode: function(e) {
    return Session.get('redeemBarcode')
  }
});

Template.redeemItem.events({
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
          console.log("redeem status:"+ error.reason);
          return;
        }

        if (result.qrcodeNotFound){
          //return throwError('This voucher not found.');
          console.log("redeem status: This voucher not found.");
          return;
        }
        
        if (result.qrcodeRedeemed){
          //return throwError('This voucher has been already redeemed.');
          console.log("redeem status: This voucher has been already redeemed.");
          return;
        }

        if (result.qrcodeExpired){
          //return throwError('This voucher Expired.');
          console.log("redeem status: This voucher Expired.");
          return;
        }

        if (result.qrcodeRedeemSuccess){
          console.log("redeem status: Redeem Success");
          Session.set('redeemItemSuccess', 1);
          Session.set('redeemSecretCode', result.secretcode);
          Session.set('redeemBarcode', result.barcode);
          return;
        }
        else{
          console.log("redeem status: Invalid merchant");
          Session.set('redeemItemFailure', 1);
          Session.set('redeemSecretCode', '');
          Session.set('redeemBarcode', '');
          return;
        }
    });
  }
});


