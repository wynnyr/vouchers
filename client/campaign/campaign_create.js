
Template.campaignCreate.onCreated(function() {
  Session.set('campaignCreateErrors', {});
  Session.set('campaignCreateShopcodes', []);
});

Template.campaignCreate.helpers({
  errorMessage: function(field) {
    return Session.get('campaignCreateErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('campaignCreateErrors')[field] ? 'has-error' : '';
  },

  shopCodes: function () {
    return Session.get("campaignCreateShopcodes");
  },

  campaignDate: function () {
    var now = new Date();
    return {
      startDate: moment(now).format("YYYY-MM-DD"),
      endDate: moment(now).format("YYYY-MM-DD"),
      startTime: moment(now).format("HH:mm"),
      endTime: moment(now).format("HH:mm")
    }
  },
});

Template.campaignCreate.events({
  'click .addshopcode': function (e) {
    e.preventDefault();

    var shopcode = prompt("Add Shopcode","");
    if (shopcode == null || shopcode == "") {
      return;
    }
    var tags = Session.get("campaignCreateShopcodes");
    tags.push(shopcode);
    Session.set("campaignCreateShopcodes", tags);

    return;
  },
 
  'click .delshopcode': function (e) {
    e.preventDefault();
    var tags = Session.get("campaignCreateShopcodes");
    tags.pop();
    Session.set("campaignCreateShopcodes", tags);
    return;
  },

  'submit form': function(e) {
    e.preventDefault();

    var cpDate = {
      startDate : $(e.target).find('[name=startdate]').val(),
      startTime : $(e.target).find('[name=starttime]').val(),
      endDate   : $(e.target).find('[name=enddate]').val(),
      endTime   : $(e.target).find('[name=endtime]').val(),
    }

    var contentId = Session.get('imageUploadId');

    if (! contentId)
      contentId = "";

    var campaignProperties = {
      title:  $(e.target).find('[name=title]').val(),
      number: $(e.target).find('[name=number]').val(),
      headline: $(e.target).find('[name=headline]').val(),
      desc: $(e.target).find('[name=desc]').val(),
      startdate: moment(cpDate.startDate +" "+ cpDate.startTime,"YYYY-MM-DD HH:mm")._d,
      enddate: moment(cpDate.endDate +" "+cpDate.endTime,"YYYY-MM-DD HH:mm")._d,
      content: contentId,
      shopcodes : Session.get("campaignCreateShopcodes"),
      barcode: $(e.target).find('[name=barcode]').val(),
      showSecretCode : $(e.target).find('[name=secretcode]').prop("checked"),
      url: $(e.target).find('[name=url]').val(),
      redeemtype : e.target.redeemtype.value
    };

    var errors = validateCampaign(campaignProperties);
    if (errors.title || errors.number || errors.headline || errors.desc){
      return Session.set('campaignCreateErrors', errors);
    }

    Meteor.call('campaignInsert', campaignProperties, function(error, result) {
    //display the error to the user and abort
      if (error){
        return throwError(error.reason);
      }

      if (result.postExists){
        throwError('This campaign has already');
      }
 
      Router.go('campaignPage', {_id: result._id});  
    });
  }
});