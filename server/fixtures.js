// Fixture data for Test

import { Random } from 'meteor/random'

if (Campaigns.find().count() === 0) {

      var now = new Date().getTime();

      Accounts.createUser({username:'fufu',password:'123456'})
      var fufu = Meteor.users.findOne({username:'fufu'});
    
      Accounts.createUser({username:'nook',password:'123456'})
      var nook = Meteor.users.findOne({username:'nook'});
/*  
      var bbq = Campaigns.insert({
            title: 'BBQ Plaza ชุด Special',
            number:'BBQ001',
            headline: 'BBQ Plaza Special SET',
            desc: 'Free ! Pork premium 1 set limited 100 set/day',
            startdate: new Date(now),
            enddate:   new moment()._d,
            content:'',
            shopcodes:['1234','5678'],
            shopcodesLen: 2,
            barcode:'123456789012',
            url: 'http://thaiprivileges.com/viva-aviv-the-river/',
            submitted: new Date(now - 2 * 24 * 3600 * 1000),
            userId: fufu._id,
            author: fufu.username,
            redeemtype:'unique',
            showSecretCode:true,
            qrcodesCount: 11,
            totalRedeem: 1,
            totalView: 1,
            totalFail: 0
      }); 

      var qrId = Qrcodes.insert({
            campaignId: bbq,
            userId: fufu._id,
            author: fufu.username,
            submitted: new Date(now - 2 * 24 * 3600 * 1000),
            body: 'aaaaaaa aaaaaaa aaaaaaa aaaaaaa',
            code:'ABCD1',
            secretcode: Random.id(4),
            redeem: 1,
            view: 1,
            fail:0,
            redeemed: now
      });

      var qrcode = Qrcodes.findOne(qrId);
      Redeems.insert({
            campaignId: qrcode.campaignId,
            qrcode: qrcode.code,
            shopcode: 1234,
            date : new Date(now + 2 * 24 * 3600 * 1000),
      });

      for (var i = 0; i < 10; i++) {
            Qrcodes.insert({
                  campaignId: bbq,
                  userId: fufu._id,
                  author: fufu.username,
                  submitted: new Date((now - 2 * 24 * 3600 * 1000)+i+1),
                  body: 'bbbbbbbb bbbbbbbb bbbbbbbb bbbbbbbb' + i,
                  code: 'bbq' + i,
                  secretcode: Random.id(4),
                  redeem: 0,
                  view: 0,
                  fail: 0
            });
      }     
        
      var viva = Campaigns.insert({
         title: 'VIVA',
         number:'VIVA001',
         headline: 'Free Drink',
         desc: 'Free drink',
         startdate: new Date(now - 2 * 24 * 3600 * 1000),
         enddate: new Date(now + 7 * 24 * 3600 * 1000),
         content:'',
         shopcodes:['1234'],
         shopcodesLen:1,
         barcode:'123456789012',
         url: 'http://thaiprivileges.com/viva-aviv-the-river/',
         submitted: new Date(now - 2 * 24 * 3600 * 1000),
         userId: nook._id,
         author: nook.username,
         redeemtype:'unique',
         showSecretCode:true,
         qrcodesCount: 5,
         totalRedeem: 0,
         totalView: 0,
         totalFail: 0
      }); 

      for (var i = 0; i < 5; i++) {
            Qrcodes.insert({
                  campaignId: viva,
                  userId: nook._id,
                  author: nook.username,
                  submitted: new Date((now - 2 * 24 * 3600 * 1000)+i+1),
                  body: 'DDDDDDDDDD RRRRRRRRRR RRRRRRRRRRR RRRRRRRRR' + i,
                  code: 'viva' + i,
                  secretcode: Random.id(4),
                  redeem: 0,
                  view: 0,
                  fail: 0
            });
      } 

      var jin = Campaigns.insert({
            title: 'JINTON Super PACK',
            number:'JSP001',
            headline: 'Jinton nude Liquid Toothpaste',
            desc: 'แสดงคูปองนี้เพื่อรับฟรี Gift Set จาก Jinton ได้ที่บูธในงาน',
            startdate: new Date(now - 2 * 24 * 3600 * 1000),
            enddate: new Date(now + 10 * 24 * 3600 * 1000),
            content:'',
            shopcodes:['5678'],
            hopcodesLen:1,
            barcode:'123456789012',
            url: 'http://thaiprivileges.com/viva-aviv-the-river/',
            submitted: new Date(now - 3 * 24 * 3600 * 1000),
            userId: fufu._id,
            author: fufu.username,
            redeemtype:'unverser',
            showSecretCode: '1',
            qrcodesCount: 1,
            totalRedeem: 0,
            totalView: 0,
            totalFail: 0
         }); 

      Qrcodes.insert({
            campaignId: jin,
            userId: fufu._id,
            author: fufu.username,
            submitted: new Date(now - 2 * 24 * 3600 * 1000),
            body: 'aaaaaaa aaaaaaa aaaaaaa aaaaaaa',
            code:'JSP1',
            secretcode: Random.id(4),
            redeem: 0,
            view: 0,
            fail: 0
      });

      for (var i = 0; i < 5; i++) {
            var number = 'Testfufu' + i;
            var CampaignsID = Campaigns.insert({
                  title: 'Test Campaigns fufu#' + i,
                  number: number,
                  headline: 'headline' + number,
                  desc: 'desc'+ number,
                  startdate: new Date(now - 2 * 24 * 3600 * 1000),
                  enddate: new Date(now + 10 * 24 * 3600 * 1000),
                  content:'',
                  shopcodes:['4361'],
                  hopcodesLen:1,
                  barcode:'123456789012',
                  url: 'http://google.com/?q=test-' + i,
                  submitted: new Date(now - (i+4) * 24 * 3600 * 1000),
                  userId: fufu._id,
                  author: fufu.username,
                  redeemtype:'unverser',
                  showSecretCode: true,
                  qrcodesCount: 2,
                  totalRedeem: 0,
                  totalView: 0,
                  totalFail: 0
            });

            for (var j = 0; j < 2; j++) {
                  Qrcodes.insert({
                        campaignId: CampaignsID,
                        userId: fufu._id,
                        author: fufu.username,
                        submitted: new Date((now - 2 * 24 * 3600 * 1000)+j+1),
                        body: 'DDDDDDDDDD RRRRRRRRRR RRRRRRRRRRR RRRRRRRRR' + j,
                        code: Random.id(6),
                        secretcode: Random.id(4),
                        redeem: 0,
                        view: 0,
                        fail: 0
                  });
            } 


      }


      for (var i = 0; i < 5; i++) {
            var number = 'Testnook' + i;
            var CampaignsID = Campaigns.insert({
                  title: 'Test Campaigns nook#' + i,
                  number: number,
                  headline: 'headline' + number,
                  desc: 'desc'+number,
                  startdate: new Date(now - 2 * 24 * 3600 * 1000),
                  enddate: new Date(now + 10 * 24 * 3600 * 1000),
                  content:'',
                  shopcodes:['4361'],
                  hopcodesLen:1,
                  barcode:'123456789012',
                  url: 'http://google.com/?q=test-' + i,
                  submitted: new Date(now - (i+4) * 24 * 3600 * 1000),
                  userId: nook._id,
                  author: nook.username,
                  redeemtype:'unverser',
                  showSecretCode: true,
                  qrcodesCount: 2,
                  totalRedeem: 0,
                  totalView: 0,
                  totalFail: 0
            });

            for (var j = 0; j < 2; j++) {
                  Qrcodes.insert({
                        campaignId: CampaignsID,
                        userId: nook._id,
                        author: nook.username,
                        submitted: new Date((now - 2 * 24 * 3600 * 1000)+j+1),
                        body: 'DDDDDDDDDD RRRRRRRRRR RRRRRRRRRRR RRRRRRRRR' + j,
                        code: Random.id(6),
                        secretcode: Random.id(4),
                        redeem: 0,
                        view: 0,
                        fail: 0
                  });
            } 
      }
*/
}

