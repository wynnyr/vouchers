Meteor.publish('campaigns', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Campaigns.find({}, options);
});

Meteor.publish('singleCampaign', function(_id) {
  check(_id, String)
  return Campaigns.find(_id);
});

Meteor.publish('allCampaigns', function() {
 return Campaigns.find();
});

Meteor.publishComposite('singleCampaignWithImage', function(_id) {
 check(_id, String)
 return {
   find() {
     return Campaigns.find(_id)
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

Meteor.publish('qrcodes', function(campaignId, options) {
 check(campaignId, String);
 check(options, {
   sort: Object,
   limit: Number
 });
 return Qrcodes.find({campaignId: campaignId}, options);
});

Meteor.publish('singleQrcodes', function(_id) {
 check(_id, String);
 return Qrcodes.find(_id);
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

Meteor.publishComposite('detailQrcodesFromID', function(_id) {
 check(_id, String)
 return {
   find() {
     return Qrcodes.find(_id)
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








