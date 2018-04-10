CampaignImage = new Mongo.Collection('campaignimage');

CampaignImage.allow({
    update: function(userId, campaign) { return 1},
    remove: function(userId, campaign) { return 1},
});


Meteor.methods({
    addCampaignImageFile : function(buffer){
        check(Meteor.userId(), String);
        check(buffer,Match.Where(EJSON.isBinary));

        var campaignImageId = CampaignImage.insert({campaignId: "", data:buffer});
        return {
          _id: campaignImageId,
        };
    } ,  

    delCampaignImageFile : function(campaignImageId){
        check(Meteor.userId(), String);
        check(campaignImageId,String);
        
        CampaignImage.remove(campaignImageId)
    },

    updateCampaignImage_campaignId : function(campaignImageId,campaignId){
        check(Meteor.userId(), String);
        check(campaignImageId,String);
        check(campaignId,String);

        CampaignImage.update(campaignImageId,{$set:{campaignId : campaignId}})
    },

    updateCampaignImage_buffer : function(campaignImageId,buffer){
        check(Meteor.userId(), String);
        check(campaignImageId,String);
        check(buffer,Match.Where(EJSON.isBinary));

        CampaignImage.update(campaignImageId,{$set:{data:buffer}})
    }
});
