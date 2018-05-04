import { Random } from 'meteor/random'

Qrcodes = new Mongo.Collection('qrcodes');

Qrcodes.allow({
    //update: function(userId, qrcode) { return ownsDocument(userId, qrcode) },
    //remove: function(userId, qrcode) { return ownsDocument(userId, qrcode) },
});

//Qrcodes.deny({
//   update: function(userId, qrcode, fieldNames) {
//      return (_.without(fieldNames, 'code','body').length > 0);
//    }
//});

Meteor.methods({
    qrViewCount: function(campaignId,qrId) {
        check(campaignId, String);
        check(qrId, String);

        Campaigns.update(campaignId, {
            $inc: {totalView: 1}
        });

        Qrcodes.update(qrId, {
            $inc: {view: 1},
        });
    },

    qrcodeBulk: function(campaignId, QRbody, QRCount) {
        check(Meteor.userId(), String);
        check(campaignId, String),
        check(QRbody, String),
        check(QRCount, String)


        if(QRCount > 50){
            QRCount = 50
        }

        var i=0;
        var j=0;
        while ( i < QRCount) {
            j++;
            var codeGen = Random.id(6);
            var qrcodeWithSamecode = Qrcodes.findOne({code: codeGen});
            if (qrcodeWithSamecode){ 
                if(j < 100)
                    continue;
                else{
                    return {
                        qrcodeGen  : i,
                        campaignId : campaignId
                    };
                }
            }
            
            var user = Meteor.user(); 
            qrcode = {
                campaignId: campaignId,
                code: codeGen,
                body: QRbody,
                userId: user._id,
                author: user.username,
                submitted: new Date(),
                secretcode: Random.id(4),
                redeem: 0,
                view: 0,
                fail:0
            };

            var campaignUpdateOK = Campaigns.update(campaignId, {$inc: {qrcodesCount: 1}});
            var qrcodeId = Qrcodes.insert(qrcode);
            i++;
        }
        console.log('Generator '+ i +' Code');
        return {
            qrcodeGen  : i,
            campaignId : campaignId
        };
    },

    qrcodeImport: function(campaign,data) {
        check(Meteor.userId(), String);
        check(campaign,Object);
        check(data, Array );

        if (Meteor.isClient)
        return;
        
        var qrCountCount=0;
        for ( let i = 0; i < data.length; i++ ) {
            var item = data[ i ];
            var qrcodeWithSamecode = Qrcodes.findOne({code: item.code});

            if(!item.code){
                continue;
            }

            if(!item.body) item.body = '-';
            if(!item.secretcode) item.secretcode = Random.id(4);
            if(!item.redeem) item.redeem = 0;
            if(!item.view) item.view = 0;
            if(!item.fail) item.fail = 0;


            var user = Meteor.user();
            qrcode = {
                campaignId: campaign._id,
                code: item.code,
                body: item.body,
                userId: user._id,
                author: user.username,
                submitted: new Date(),
                secretcode: item.secretcode,
                redeem:Number(item.redeem),
                view:Number(item.view),
                fail:Number(item.fail)
            };

           
            if (qrcodeWithSamecode) {
                console.log( 'Rejected. This qrcodes:'+item.code+' already exists.' )
            } else {
                console.log( 'Add qrcodes:'+item.code);
                qrCountCount++;
                Qrcodes.insert(qrcode);
                Campaigns.update(qrcode.campaignId, {$inc: {qrcodesCount: 1, totalRedeem: +(item.redeem), totalView: +(item.view), totalFail: +(item.fail)}});
            }
        }
        
        return {
            qrcodeImportCount  : qrCountCount,
            campaignId : campaign._id
        }
    },

    qrcodeInsert: function(qrcodeAttributes) {
        check(Meteor.userId(), String);
        check(qrcodeAttributes, {
            campaignId: String,
            code: String,
            body: String
        });

        var qrcodeWithSamecode = Qrcodes.findOne({code: qrcodeAttributes.code});
        if (qrcodeWithSamecode) {
            console.log('qrcodeWithSamecode'+qrcodeWithSamecode);
            return {
                qrcodeExists: true,
            }
        }

        var user = Meteor.user(); 
        qrcode = _.extend(qrcodeAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date(),
            secretcode: Random.id(4),
            redeem: 0,
            view: 0,
            fail:0
        });

        var campaignUpdateOK = Campaigns.update(qrcodeAttributes.campaignId, {$inc: {qrcodesCount: 1}});
        var qrcodeId = Qrcodes.insert(qrcode);
        return {
            qrcodeExists: false,
            campaignId: qrcodeAttributes.campaignId,
            qrcodeId: qrcodeId
        };
         
    },

    qrcodeUpdate: function(qrcodeId,qrcodeAttributes) {
        check(Meteor.userId(), String);
        check(qrcodeId,String);
        check(qrcodeAttributes, {
            code: String,
            body: String
        });

        var qrcodeWithSamecode = Qrcodes.findOne({code: qrcodeAttributes.code});
        if (qrcodeWithSamecode) {
            if (qrcodeWithSamecode._id != qrcodeId){
                return {
                    qrcodeExists: true,
                    qrcodeId:qrcodeWithSamecode
                }
            }
        }

        Qrcodes.update(qrcodeId, {$set: qrcodeAttributes}, function(error) {
            if (error) {
                return Bert.alert( error.reason, 'danger', 'growl-top-right' );
            }
        });

        return {
            qrcodeId: qrcodeId
        };
    },

    qrcodeDelete: function(qrcode) {
        check(Meteor.userId(), String);
        check(qrcode,Object);


        //check(this.userId, String);
        if(ownsDocument(Meteor.userId(), qrcode)){
            Campaigns.update(qrcode.campaignId, {$inc: {qrcodesCount: -1, totalRedeem: -(qrcode.redeem), totalView: -(qrcode.view), totalFail: -(qrcode.fail)}}, function(error){
                if (error) {
                    throw new Meteor.Error('invalid-campaign', "Error campaign update");
                }
                else{
                    Qrcodes.remove(qrcode._id);
                }
            });

            return {
                userAccessDenied : false
            } 
        }
        else{
            return {
              userAccessDenied : true
            } 
        }

        
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
                $inc: {totalRedeem: 1}
            });

            Qrcodes.update(qrcode._id, {
                $inc: {redeem: 1},
                $set:{redeemed : now}
            });

            Redeems.insert({
                campaignId: campaign._id,
                qrcode: qrcode.code,
                shopcode: qrcodeAttributes.shopcode,
                date : now
            });
            //console.log("shopcode  ->  OK");
            return {
                qrcodeRedeemSuccess: true,
                secretcode: qrcode.secretcode,
                barcode: campaign.barcode
            }   
        }
        else{
            //console.log("shopcode  ->  bad " +campaign.shopcodes+ ' = '+qrcodeAttributes.shopcode);
            Campaigns.update(campaign._id, {
                $inc: {totalFail: 1}
            });

            Qrcodes.update(qrcode._id, {
                $inc: {fail: 1},
            });
            return {
                qrcodeRedeemSuccess : false,
                secretcode: '',
                barcode:''
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

    if (!qrcode.body)
      errors.body = "Please fill note.";

    return errors;
}

validateQrcodeBulk = function (count,body) {
    var errors = {};

    if (!count)
      errors.count = "Please fill in a qrcode.";

    if (!body)
      errors.body = "Please fill note.";

    return errors;
}

isQRcode = function (campaign,qrcode){
    return campaign && qrcode;
}

