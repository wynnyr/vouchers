Campaigns = new Mongo.Collection('campaigns');

Campaigns.allow({
  update: function(userId, campaign) { return ownsDocument(userId, campaign); },
  remove: function(userId, campaign) { return ownsDocument(userId, campaign); },
});

/*
Campaigns.deny({
  update: function(userId, campaign, fieldNames) {
    return (_.without(fieldNames, 'title','number', 'headline', 'desc' , 'url' , 'content','redeemtype' ,'shopcodes','startdate','enddate','qrcodesCount').length > 0);
  }
//});
*/

Campaigns.deny({
  update: function(userId, campaign, fieldNames) {
    return (_.without(fieldNames,'qrcodesCount').length > 0);
  }
});

/*
Campaigns.deny({
  update: function(userId, campaign, fieldNames, modifier) {
    var errors = validateCampaign(modifier.$set);
    return errors.title || errors.number;
  }
});
*/

Meteor.methods({
  campaignInsert: function(campaignAttributes) {
    check(Meteor.userId(), String);
    check(campaignAttributes, {
      title: String,
      number: String,
      headline: String,
      desc: String,
      startdate: Date,
      enddate: Date,
      shopcodes: [String],
      shopcodesLen: Number,
      showSecretCode: Boolean,
      barcode: String,
      url: String,
      content: String,
      redeemtype: String
    });

    var errors = validateCampaign(campaignAttributes);
    if (errors.title || errors.number || errors.headline || errors.desc)
      throw new Meteor.Error('invalid-campaign', "Error campaign paramiter");


    var campaignWithSametitle = Campaigns.findOne({title: campaignAttributes.title});
    if (campaignWithSametitle) {
      return {
        postExists: true,
        _id: campaignWithSametitle._id
      }
    }

    var user = Meteor.user();
    var campaign = _.extend(campaignAttributes, {
      userId: user._id, 
      author: user.username, 
      submitted: new Date(),
      qrcodesCount: 0,
      totalRedeem: 0,
      totalView: 0,
      totalFail: 0
    });

    var campaignId = Campaigns.insert(campaign);
    CampaignImage.update(campaign.content,{$set:{campaignId : campaignId}}, function(error){
      if (error) {
        return Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
    });
 
    return {
      _id: campaignId
    };
  },

  campaignUpdate: function(campaignId,campaignAttributes) {
    check(Meteor.userId(), String);
    check(campaignId, String);
    check(campaignAttributes, {
      title: String,
      number: String,
      headline: String,
      desc: String,
      startdate: Date,
      enddate: Date,
      content: String,
      shopcodes: [String],
      shopcodesLen: Number,
      showSecretCode: Boolean,
      barcode: String,
      url: String,
      redeemtype: String
    });
    

    var errors = validateCampaign(campaignAttributes);
    if (errors.title || errors.number || errors.headline || errors.desc)
      throw new Meteor.Error('invalid-campaign', "Error campaign paramiter");

    //Check Same campaign title
    var campaignWithSametitle = Campaigns.findOne({title: campaignAttributes.title});
    if (campaignWithSametitle) {
      if (campaignWithSametitle._id != campaignId)
        return {
          postExists: true,
          _id: campaignWithSametitle._id
      }
    }

    Campaigns.update(campaignId, {$set: campaignAttributes}, function(error) {
      if (error) {
        return Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
    });
     return {
      _id: campaignId
    };
  },


  campaignRemove: function(campaign) {
    check(Meteor.userId(), String);
    check(campaign, Object);

    if(ownsDocument(Meteor.userId(), campaign)){
      console.log('This user can remove campaign');
      Qrcodes.remove({campaignId:campaign._id});
      CampaignImage.remove(campaign.content);
      Campaigns.remove(campaign._id);

      return {
        userAccessDenied : false
      } 
    }
    else{
        return {
          userAccessDenied : true
        } 
    }

  }
  
});

validateCampaign = function (campaign) {
  var errors = {};

  if (!campaign.title)
    errors.title = "Please fill in a title"
  else
    errors.title = '';

  if (!campaign.number)
    errors.number = "Please fill in a number";
  else
    errors.number = '';

  if (!campaign.headline)
    errors.headline = "Please fill in a headline";
  else
    errors.headline = '';

  if (!campaign.desc)
    errors.desc = "Please fill in a descrition";
  else
    errors.desc = '';

  return errors;
}