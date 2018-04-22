Meteor.methods({
   csvExport: function() {
      var collection = Qrcodes.find().fetch();
      var heading = true; // Optional, defaults to true
      var delimiter = "," // Optional, defaults to ",";
      return exportcsv.exportToCSV(collection, heading, delimiter);
    }
})