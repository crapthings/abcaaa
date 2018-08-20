Meteor.methods({
  'documents.create'({ title }) {
    return Documents.insert({ title })
  },

  'paragraphs.create'({ documentId, content }) {
    const createdAt = new Date()
    return Paragraphs.insert({ documentId, content, createdAt })
  },

  'paragraphs.update'(_id, { content }) {
    const updatedAt = new Date()
    return Paragraphs.update(_id, {
      $set: { content, updatedAt }
    })
  },

  'paragraphs.remove'(_id) {
    return Paragraphs.remove(_id)
  },

  'dev.documents.empty'() {
    return Documents.remove({})
  },
})