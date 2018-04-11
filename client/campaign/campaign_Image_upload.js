
Template.imageUpload.onCreated(function() {
	Session.set('imageUploadId', "");
	Session.set('imageSizeOver', {});
});

Template.imageUpload.events({
    'change #file-input': function(event){

		var file = event.target.files[0];
		var photopreview = document.getElementById('photopreview_selecet');

		if (!file) 
		{
			photopreview.style = "";
			photopreview.src = "";
			return;
		}

		var imageUploadId = Session.get("imageUploadId");
		var pImageUpload = this.campaignImage;
		if(pImageUpload || imageUploadId){
			if(!imageUploadId)
				imageUploadId = pImageUpload._id

			//console.log('imageId1->'+ imageUploadId)

			var reader = new FileReader();
			reader.onload = function(event){  
				var buffer = new Uint8Array(reader.result);
				//console.log("file Size="+buffer.length);

				if (buffer.length >1000000){
					Session.set("imageSizeOver",{'imageSizeOver' : 'Image is too big. Max. 1 MB'});
				}else{
					Session.set("imageSizeOver", {'imageSizeOver' : ''});

					var blob = new Blob( [ buffer ], { type: "image/jpeg" } );
					var urlCreator = window.URL || window.webkitURL;
					var imageUrl = urlCreator.createObjectURL( blob );
					photopreview.style = "display:block; width:400px;height:Auto;";
					photopreview.src = imageUrl;
					Meteor.call('updateCampaignImage_buffer', imageUploadId, buffer);
					Session.set("imageUploadId", imageUploadId);
				}
			}
			reader.readAsArrayBuffer(file);
		}
		else{
			console.log('imageId1->null')
			var reader = new FileReader();
			reader.onload = function(event){  
				buffer = new Uint8Array(reader.result)
				//console.log("file Size="+buffer.length);
				
				if (buffer.length >1000000){
					Session.set("imageSizeOver",{'imageSizeOver' : 'Image is too big. Max. 1 MB'});
				}else{
					Session.set("imageSizeOver", {'imageSizeOver' : ''});
				
					var blob = new Blob( [ buffer ], { type: "image/jpeg" } );
					var urlCreator = window.URL || window.webkitURL;
					var imageUrl = urlCreator.createObjectURL( blob );
					photopreview.style = "display:block; width:400px;height:Auto;";
					photopreview.src = imageUrl;
				
					Meteor.call('addCampaignImageFile', buffer, function(error, result) {
						Session.set("imageUploadId", result._id);
						//console.log('Add imageId to Session->'+result._id)
					});
				}
			}
			reader.readAsArrayBuffer(file);
		}
	},


});

Template.imageUpload.helpers({
	imageSoure : function(pImage) {
		if (pImage){
			//console.log('imageId_helpers->' + pImage._id)
			var blob = new Blob( [ pImage.data ], { type: "image/jpeg" } );
			var urlCreator = window.URL || window.webkitURL;
			var imageUrl = urlCreator.createObjectURL( blob );
			return '<img id="photopreview" src = " ' +imageUrl+ ' " style = "display:block; width:400px;height:Auto;" />'
		}
		else{
			return  '<img id="photopreview"/>' ;
		}
	},	

	errorMessage: function(field) {
		return Session.get('imageSizeOver')[field];
	},
	errorClass: function (field) {
		return !!Session.get('imageSizeOver')[field] ? 'has-error' : '';
	},
});
