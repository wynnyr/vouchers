Meteor.methods({
   csvExport: function(campaignId) {
      check(Meteor.userId(), String);
      check(campaignId, String);
      var qrcodes = Qrcodes.find( {campaignId:campaignId,userId:Meteor.userId()},
                                 {
                                    fields:
                                    {
                                       campaignId:false,
                                       userId:false,
                                       author:false,
                                       submitted:false,
                                    }
                                 }).fetch();
/*
      var qrdata = {
         qrId: qrcodes._id,
         code: qrcodes.code,
         secretCode: qrcodes.secretCode,
         body:qrcodes.body,
         redeem: qrcodes.redeem,
         view: qrcodes.view,
         fail: qrcodes.fail,
         redeemed: moment(qrcodes.redeemed,"YYYY-MM-DD HH:mm:ss")._d,
      }                            
*/
      return {
         data: qrcodes
      };
   },

   csvImport: function(campaignId) {
      check(Meteor.userId(), String);
      check(campaignId, String);

   }
})