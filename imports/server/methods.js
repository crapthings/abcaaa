Meteor.methods({
  'nodes.create.isRoot'({ content }) {
    content = content || faker.lorem.sentences()
    const node = {
      isRoot: true,
      expanded: true,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return Nodes.insert(node)
  },

  'nodes.create'({ rootId, parentNodeId, content }) {
    content = content || faker.lorem.sentences()
    const node = {
      rootId,
      parentNodeId,
      expanded: true,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return Nodes.insert(node)
  },

  'nodes.create.parse'({ text }) {
    const _text = _.chain(text)
      .split(/\n/)
      .map(_.trim)
      .filter(_.Empty)
      .value()
    const content = _text[0]
    const rootId = parentNodeId = Meteor.call('nodes.create.isRoot', { content })
    const contents = _.map(_.drop(_text), content => {
      return {
        rootId,
        parentNodeId,
        content,
        expanded: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })
    return Nodes.batchInsert(contents)
  },

  'nodes.update.parent'(_id, { parentNodeId }) {
    return Nodes.update(_id, { $set: { parentNodeId } })
  },

  'nodes.update.expanded'(_id, { expanded }) {
    return Nodes.update(_id, { $set: { expanded } })
  },

  'nodes.remove'(_id) {
    const hasChildren = Nodes.findOne({ parentNodeId: _id })
    if (hasChildren) return
    return Nodes.remove(_id)
  },

  'dev.empty'() {
    return [Nodes.remove({})]
  },
})
