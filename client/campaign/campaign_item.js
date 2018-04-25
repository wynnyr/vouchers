Template.campaignItem.helpers({
  ownCampaign: function() {
     return this.userId === Meteor.userId();
  },
});

Template.campaignItem.events({
  'click .csvExport': function(e) {
    e.preventDefault();

    Meteor.call('csvExport',this._id, function(error, result) {
      if (error){
        return throwError(error.reason);
      }
      var csvContent = Papa.unparse(result.data);
      window.open('data:text/csv;charset=utf-8,' + escape(csvContent), '_self');
    });
  },
});