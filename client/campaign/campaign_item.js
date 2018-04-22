Template.campaignItem.helpers({
  ownCampaign: function() {
     return this.userId === Meteor.userId();
  },
});

Template.campaignItem.events({
  'click .csvExport': function(e) {
    e.preventDefault();
    console.log("csvExport")

  },

  'click .bulkAdd': function (e) {
    e.preventDefault();
    var count = prompt("Mass QR Code Generator","3");
    if (count == null || count == "") {
      return;
    }

    Meteor.call('qrcodeBulk', this._id, count,function(error, result){
      if (error){
        return throwError(error.reason);
      }

      Router.go('campaignPage', {_id: result.campaignId}); 

    });
  }


});