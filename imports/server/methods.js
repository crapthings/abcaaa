Meteor.methods({
  'documents.create'({ title }) {
    return Documents.insert({ title })
  },

  'documents.update'(_id, { title, labels }) {
    return Documents.update(_id, { $set: { title, labels } })
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

  'paragraphs.update.labels'(_id, { labels }) {
    const updatedAt = new Date()
    labels = _.reject(labels, _.isEmpty)
    labels = _.uniq(labels)
    return Paragraphs.update(_id, {
      $set: { labels, updatedAt }
    })
  },

  'paragraphs.remove'(_id) {
    return Paragraphs.remove(_id)
  },

  'dev.documents.empty'() {
    return Documents.remove({})
  },
})
