Template.qrcodeItem.helpers({
  submittedText: function() {
     return this.submitted.toString();
   }
});

Template.qrcodeItem.helpers({
  redeemcode: function(){
    var a = document.createElement('a');
    a.href = Location.host;
    return location.host+ "/redeem/" + this.code.toString();
  }
});
