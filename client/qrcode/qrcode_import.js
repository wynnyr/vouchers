Template.qrcodeImport.onCreated(function() {
   Session.set('FileFormatErr', {});
   Template.instance().uploading = new ReactiveVar( false );
 });
 
Template.qrcodeImport.helpers({
   errorMessage: function(field) {
      return Session.get('FileFormatErr')[field];
   },
 
   errorClass: function (field) {
      return !!Session.get('FileFormatErr')[field] ? 'has-error' : '';
   },
   uploading() {
    return Template.instance().uploading.get();
  }
 });

 Template.qrcodeImport.events({
  'change [name="uploadCSV"]' ( event, template ) {
    template.uploading.set( true );
    var campaign = this;

    Papa.parse( event.target.files[0], {
      header: true,
      complete( results, file ) {
        Meteor.call('qrcodeImport',campaign,results.data, function(error, result) {
          if ( error ) {
            console.log( error.reason );
          } else {
            template.uploading.set( false );
            Bert.alert( 'Upload complete!', 'success', 'growl-top-right' );
          }
      });
      }
    });
  }
});
