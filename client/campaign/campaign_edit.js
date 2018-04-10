
var firstLoad=0

Template.campaignEdit.onCreated(function() {
   Session.set('campaignEditErrors', {});
   Session.set('campaignEditShopcodes', []);
   firstLoad = 0;
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

  campaignDate: function () {
    return {
      startDate: moment(this.campaign.startdate).format("YYYY-MM-DD"),
      endDate: moment(this.campaign.enddate).format("YYYY-MM-DD"),
      startTime: moment(this.campaign.startdate).format("HH:mm"),
      endTime: moment(this.campaign.enddate).format("HH:mm")
    }
  },
  rdtypeUnique: function () {
    if (this.campaign.redeemtype === 'unique')
      return 'checked';
  },

  rdtypeUnverser: function () {
    if (this.campaign.redeemtype === 'unverser')
      return 'checked';
  },

  ownCampaign: function(campaign) {
    return ownsDocument(Meteor.userId(),campaign)
  },
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
      url:  $(e.target).find('[name=url]').val(),
      redeemtype : e.target.redeemtype.value
    }

    var errors = validateCampaign(campaignProperties);
    if (errors.title || errors.number || errors.headline || errors.desc){
      return Session.set('campaignEditErrors', errors);
    }
 
    Meteor.call('updateCampaignImage_campaignId', contentId,currentCampaignId);
    Campaigns.update(currentCampaignId, {$set: campaignProperties}, function(error) {
      if (error) {
        throwError(error.reason);
      } else {
          firstOpen=0
          Router.go('campaignPage', {_id: currentCampaignId});
      }
    });

    
  },
 
  'click .delete': function(e) {
    e.preventDefault();
 
    if (confirm("Delete this campaign?")) {
      Meteor.call('campaignRemove',this.campaign, function(error, result){
        if (error){
          return throwError(error.reason);
        }

        if (result.userAccessDenied){
          return throwError('permissions')
        }

        Session.set('imageUploadId',"");
        Router.go('campaignsList');
      });
    }
  }
  
});