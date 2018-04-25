Meteor.methods({
   csvExport: function(campaignId) {
      check(Meteor.userId(), String);
      check(campaignId, String);
      var qrdata = Qrcodes.find( {campaignId:campaignId,userId:Meteor.userId()},
                                 {
                                    fields:
                                    {
                                       campaignId:false,
                                       userId:false,
                                       author:false,
                                       submitted:false,
                                    }
                                 }).fetch();
      return {
         data: qrdata
      };
   }
})