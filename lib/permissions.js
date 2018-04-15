// check that the userId specified owns the documents
ownsDocument = function(userId, doc) {
   //console.log("owns_userId      ->" + userId);
   //console.log("owns_doc.userId  ->" + doc.userId);
   console.log("owns->"+ (doc && doc.userId === userId));
   return doc && doc.userId === userId;
}