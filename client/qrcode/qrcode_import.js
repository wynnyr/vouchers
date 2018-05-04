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
        Meteor.call('qrcodeImport',campaign, results.data, function(error, result) {
          if ( error ) {
            console.log( error.reason );
          } 
          else 
          {
            if(result.qrcodeImportCount == 0){
              Bert.alert( 'Import code Error', 'danger', 'growl-top-right' );
              console.log('Import code Fail');
            }
            else if(result.qrcodeImportCount<results.data.length){
              Bert.alert( 'Import success '+result.qrcodeImportCount+' form '+results.data.length+' code', 'warning', 'growl-top-right');
              console.log('Import success '+result.qrcodeImportCount+' form '+results.data.length+' code');
              Router.go('campaignPage', {_id: result.campaignId});
            }
            else{
              Bert.alert( 'Import '+result.qrcodeImportCount+' code complete!', 'success', 'growl-top-right' );
              Router.go('campaignPage', {_id: result.campaignId});
            }
            template.uploading.set( false );
          }
        });
      }
    });
  }
});
