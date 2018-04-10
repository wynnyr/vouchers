Qrcodes = new Mongo.Collection('qrcodes');

Qrcodes.allow({
    update: function(userId, qrcode) { return ownsDocument(userId, qrcode) },
    remove: function(userId, qrcode) { return ownsDocument(userId, qrcode) },
});

Qrcodes.deny({
    update: function(userId, qrcode, fieldNames) {
      return (_.without(fieldNames, 'code','body').length > 0);
    }
});

Meteor.methods({
    qrcodeInsert: function(qrcodeAttributes) {
        check(this.userId, String);
        check(qrcodeAttributes, {
            campaignId: String,
            code: String,
            body: String
        });

        var qrcodeWithSamecode = Qrcodes.findOne({code: qrcodeAttributes.code});
        if (qrcodeWithSamecode) {
            return {
                qrcodeExists: true,
            }
        }

        var user = Meteor.user(); 
        qrcode = _.extend(qrcodeAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date(),
            redeem: 0
        });

        var campaignUpdateOK = Campaigns.update(qrcodeAttributes.campaignId, {$inc: {qrcodesCount: 1}});
        var qrcodeId = Qrcodes.insert(qrcode);
        return {
            qrcodeExists: false,
            campaignId: qrcodeAttributes.campaignId,
            qrcodeId: qrcodeId
        };
         
    },

    qrcodeRedeem: function(qrcodeAttributes) {
        check(qrcodeAttributes, {
            qrcodeId: String,
            campaignId: String,
            shopcode: String
        });

        var qrcode   = Qrcodes.findOne({_id: qrcodeAttributes.qrcodeId});
        var campaign = Campaigns.findOne({_id: qrcodeAttributes.campaignId});

        var now     =  new Date();
        var nowInt  =  new Date(now).getTime();
        var campaignStart = new Date(campaign.startdate).getTime();
        var campaignEnd   = new Date(campaign.enddate).getTime();

        if (!qrcode && !campaign) {
            //console.log("error  ->  qrcodeNotFound");
            return {
                qrcodeNotFound: true
            }  
        }

        if (campaign.redeemtype === 'unique' && qrcode.redeem > 0){
            //console.log("error  ->  qrcodeRedeemed");
            return {
                qrcodeRedeemed: true
            }   
        }

        if ( nowInt < campaignStart || nowInt > campaignEnd){
            //console.log("error  ->  qrcodeExpired");
            return {
                qrcodeExpired: true
            }   
        }

        if (_.include(campaign.shopcodes, qrcodeAttributes.shopcode))
        {
            //console.log("shopcode  ->  OK " +campaign.shopcodes+ ' = '+qrcodeAttributes.shopcode);
            Campaigns.update(campaign._id, {
                $inc: {redeemed: 1}
            });

            Qrcodes.update(qrcode._id, {
                $inc: {redeem: 1}
            });

            Redeems.insert({
                campaignId: campaign._id,
                qrcode: qrcode.code,
                shopcode: qrcodeAttributes.shopcode,
                date : now
            });
            console.log("shopcode  ->  OK");
            return {
                QRcodeRedeem: true
            }   
        }
        else{
            //console.log("shopcode  ->  bad " +campaign.shopcodes+ ' = '+qrcodeAttributes.shopcode);
            return {
                qrcodeShopCodeFail: true
            } 
        }
   }   
});

validateQrcode = function (qrcode) {
    var errors = {};
  
    if (!qrcode.shopcode)
      errors.shopcode = "Please fill in a shopcode.";
    

    return errors;
}

validateQrcodeCreate = function (qrcode) {
    var errors = {};
  
    if (!qrcode.code)
      errors.code = "Please fill in a qrcode.";

    if (!qrcode.redeemtype)
      errors.redeemtype = "Please select type of redeem.";

    if (!qrcode.body)
      errors.body = "Please fill note.";

    return errors;
}

