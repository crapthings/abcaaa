Meteor.publish('documents', function () {
  return Documents.find()
})

Meteor.publish('document', function (_id) {
  return [Documents.find({ _id }), Paragraphs.find({ documentId: _id })]
})

Meteor.publish('paragraphs', function (documentId) {
  return Paragraphs.find({ documentId })
})