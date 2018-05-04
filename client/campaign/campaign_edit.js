
var firstLoad=0
var diableLoadData = 0;
var data= {};

Template.campaignEdit.onCreated(function() {
   Session.set('campaignEditErrors', {});
   Session.set('campaignEditShopcodes', []);
   firstLoad = 0;
   diableLoadData = 0;
});
 
Template.campaignEdit.helpers({
  errorMessage: function(field) {
    return Session.get('campaignEditErrors')[field];
  },

  errorClass: function (field) {
    return !!Session.get('campaignEditErrors')[field] ? 'has-error' : '';
  },

  shopCodes: function () {
  if(firstLoad==0){
      firstLoad=1;
      Session.set("campaignEditShopcodes",this.campaign.shopcodes);
    }
    return Session.get("campaignEditShopcodes");
  },

  ownCampaign: function(campaign) {
    if (!campaign)
      return 0;
    return ownsDocument(Meteor.userId(),campaign)
  },

  campaignData: function (){
  if (diableLoadData == 0){

      var rdtypeUnique   = '';
      var rdtypeUnverser = '';
      var cbshowSecretCode = '';

      if (this.campaign.redeemtype === 'unique')
        rdtypeUnique ='checked';  

      if (this.campaign.redeemtype === 'unverser')
        rdtypeUnverser = 'checked';

      if (this.campaign.showSecretCode == true)
        cbshowSecretCode = 'checked';

      data = {
        title: this.campaign.title,
        number: this.campaign.number,
        headline: this.campaign.headline,
        desc: this.campaign.desc,
        startdate: moment(this.campaign.startdate).format("YYYY-MM-DD"),
        enddate: moment(this.campaign.enddate).format("YYYY-MM-DD"),
        starttime: moment(this.campaign.startdate).format("HH:mm"),
        endtime: moment(this.campaign.enddate).format("HH:mm"),
        rdtypeUnique: rdtypeUnique,
        rdtypeUnverser: rdtypeUnverser,
        cbshowSecretCode : cbshowSecretCode,
        barcode: this.campaign.barcode,
        url: this.campaign.url,
      }
      
    }
    return data
    
  }
}); 

Template.campaignEdit.events({
  'click .addshopcode': function (e) {
    e.preventDefault();
    
    var shopcode = prompt("Add Shopcode","");
    if (shopcode == null || shopcode == "") {
      return;
    }

    var tags = Session.get("campaignEditShopcodes");
    tags.push(shopcode);
    Session.set("campaignEditShopcodes", tags);
    return;
  },
 
  'click .delshopcode': function (e) {
    e.preventDefault();

    var tags = Session.get("campaignEditShopcodes");
    tags.pop();
    Session.set("campaignEditShopcodes", tags);
    return;
  },

  'submit form': function(e) {
    e.preventDefault();

    diableLoadData = 1;

    var cpDate = {
      startDate : $(e.target).find('[name=startdate]').val(),
      startTime : $(e.target).find('[name=starttime]').val(),
      endDate   : $(e.target).find('[name=enddate]').val(),
      endTime   : $(e.target).find('[name=endtime]').val(),
    }

    var contentId = Session.get('imageUploadId');
    if (!contentId){
      contentId = this.campaign.content;
    }

    var currentCampaignId = this.campaign._id;
    var campaignProperties = {
      title:  $(e.target).find('[name=title]').val(),
      number: $(e.target).find('[name=number]').val(),
      headline: $(e.target).find('[name=headline]').val(),
      desc: $(e.target).find('[name=desc]').val(),
      startdate: moment(cpDate.startDate +" "+ cpDate.startTime,"YYYY-MM-DD HH:mm")._d,
      enddate: moment(cpDate.endDate +" "+ cpDate.endTime,"YYYY-MM-DD HH:mm")._d,
      content: contentId,
      shopcodes : Session.get("campaignEditShopcodes"),
      shopcodesLen: Session.get("campaignEditShopcodes").length,
      showSecretCode : $(e.target).find('[name=secretcode]').prop("checked"),
      barcode: $(e.target).find('[name=barcode]').val(),
      url:  $(e.target).find('[name=url]').val(),
      redeemtype : e.target.redeemtype.value
    }

    var errors = validateCampaign(campaignProperties);
    if (errors.title || errors.number || errors.headline || errors.desc){
      return Session.set('campaignEditErrors', errors);
    }

    Meteor.call('updateCampaignImage_campaignId', contentId, currentCampaignId);

    Meteor.call('campaignUpdate', currentCampaignId, campaignProperties, function(error, result) {
      if (error){
        return Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
      if (result.postExists){
        var errors = {};
        errors.title = 'Title "'+ campaignProperties.title + '" has already';
        Bert.alert( 'Title "'+ campaignProperties.title + '" has already', 'danger', 'growl-top-right' );
        return Session.set('campaignEditErrors', errors);
      }

      firstOpen=0
      Bert.alert( 'Update campaign "'+ campaignProperties.title +'" Complete', 'success', 'growl-top-right' );
      Router.go('campaignPage', {_id: result._id}); 
    });
  },
 
  'click .delete': function(e) {
    e.preventDefault();
    var campaignTitle = this.campaign.title;
 
    if (confirm("Delete this campaign?")) {
      Meteor.call('campaignRemove',this.campaign, function(error, result){
        if (error){
          return Bert.alert( error.reason, 'danger', 'growl-top-right' );
        }

        if (result.userAccessDenied){
          return  Bert.alert( 'permissions', 'danger', 'growl-top-right' );
        }

        Bert.alert( 'Delete '+ campaignTitle +' Complete', 'success', 'growl-top-right' );
        Session.set('imageUploadId',"");
        Router.go('campaignsList');
      });
    }
  }
  
});