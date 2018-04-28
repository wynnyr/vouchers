Template.campaignItem.helpers({
  ownCampaign: function() {
     return this.userId === Meteor.userId();
  },
});

Template.campaignItem.events({
  'click .csvExport': function(e) {
    e.preventDefault();

    if (confirm("You want to export qrcode ?")) {

      Meteor.call('csvExport',this._id, function(error, result) {
        if (error){
          return Bert.alert( error.reason, 'danger', 'growl-top-right' );
        }
        var csvContent = Papa.unparse(result.data);
        window.open('data:text/csv;charset=utf-8,' + escape(csvContent), '_self');
    });
  } 
  },

  //'click .csvImport': function(e) {
  //  e.preventDefault();

  //}
  
});