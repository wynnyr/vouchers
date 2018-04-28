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

    Papa.parse( event.target.files[0], {
      header: true,
      complete( results, file ) {
        Bert.alert( 'Upload complete!', 'success', 'growl-top-right' );
      }
    });
  }
});
