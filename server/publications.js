Meteor.publish('campaignsAll', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Campaigns.find({}, options);
});

Meteor.publish('campaigns', function(userId,options) {
  check(userId, String)
  check(options, {
    sort: Object,
    limit: Number
  });
  return Campaigns.find({userId: userId}, options);
});

Meteor.publish('singleCampaign', function(_id, userId) {
  check(_id, String);
  check(userId, String);
  return Campaigns.find({_id: _id, userId: userId});
});

Meteor.publishComposite('singleCampaignWithImage', function(_id,userId) {
 check(_id, String)
 check(userId, String);
 return {
   find() {
     return Campaigns.find({_id: _id, userId: userId})
   },
   children: [
     {
       find(campaign) {
         return CampaignImage.find({_id: campaign.content})
       }
     }
   ]
 }
});

Meteor.publish('qrcodes', function(campaignId, userId, options) {
 check(campaignId, String);
 check(userId, String)
 check(options, {
   sort: Object,
   limit: Number
 });
 return Qrcodes.find({campaignId: campaignId, userId: userId}, options);
});

Meteor.publish('singleQrcodes', function(_id,userId) {
 check(_id, String);
 check(userId, String)
 return Qrcodes.find({_id: _id, userId: userId});
});

Meteor.publishComposite('detailQrcodesFromQR', function(qr) {
 check(qr, String)
 return {
   find() {
     return Qrcodes.find({code : qr})
   },
   children: [
     {
       find(qrcode) {
         return Campaigns.find({_id: qrcode.campaignId})
       }
     }
   ]
 }
});

Meteor.publishComposite('detailQrcodesFromID', function(_id,userId) {
 check(_id, String)
 check(userId, String)
 return {
   find() {
     return Qrcodes.find({_id: _id, userId: userId})
   },
   children: [
     {
       find(qrcode) {
         return Campaigns.find({_id: qrcode.campaignId})
       }
     }
   ]
 }
});

Meteor.publishComposite('detailQrcodesWithImageFromQR', function(qr) {
  //publish for 
  // 1. route -> /redeem/:qrcode -> redeem_item page

  check(qr, String)
  return {
    find() {
      return Qrcodes.find({code : qr})
    },
    children: [
      {
        find(qrcode) {
          return Campaigns.find(
            {
              _id: qrcode.campaignId
            },
            {
              fields:
              {
                author:false, 
                qrcodesCount:false,
                redeemed:false,
                shopcodes:false,
                submitted:false,
              }
            }
          )
        }
      },
      {
        find(qrcode) {
          return CampaignImage.find(
            {
              campaignId: qrcode.campaignId
            },
            {
              fields:
              {
                author:false,
                redeem:false,
                submitted:false,
              }
            }
          )
        }
      }
    ]
  }
 });

Meteor.publish('allRedeems', function() {
 return Redeems.find();
});

Meteor.publish('redeems', function(options) {
 check(options, {
   sort: Object,
   limit: Number
 });
 return Redeems.find({}, options);
});

Meteor.publish('singleRedeems', function(_id) {
 check(_id, String)
 return Redeems.find(_id);
});








