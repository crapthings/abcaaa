Meteor.methods({
  'nodes.create.isRoot'({ content }) {
    content = content || faker.lorem.sentences()
    const node = {
      order: 1,
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
    let base_order = 1
    const content = _text[0]
    const rootId = parentNodeId = Meteor.call('nodes.create.isRoot', { order: base_order, content })
    const contents = _.map(_.drop(_text), (content, idx) => {
      const order = base_order + idx + 1
      console.log(order)
      return {
        order,
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

  'nodes.update.parent'(_id, { order, parentNodeId }) {
    return Nodes.update(_id, { $set: { order, parentNodeId } })
  },

  'nodes.update.expanded'(_id, { expanded }) {
    return Nodes.update(_id, { $set: { expanded } })
  },

  'nodes.update.labels'(_id, { labels }) {
    // let labelIds = []
    // const foundLabels = Labels.find({ name: { $in: labels } }).fetch()
    // const newLabels = _.intersection(_.map(foundLabels, 'name'), labels)
    // console.log(labels, foundLabels, newLabels)
    // if (_.isEmpty(newLabels)) {
    //   labelIds = _.map(labels, name => {
    //     return Labels.insert({ name })
    //   })
    // }

    return Nodes.update(_id, { $set: { labels } })
  },

  'nodes.remove'(_id) {
    const hasChildren = Nodes.findOne({ parentNodeId: _id })
    console.log(hasChildren)
    if (hasChildren) return
    return Nodes.remove(_id)
  },

  'dev.build'(id, keywords) {
    keywords = keywords.split(' ')
    const _node = Nodes.findOne(id)
    if (!_node) return
    let relatedNodes = Nodes.find({ labels: { $in: keywords } }).fetch()
    // mock level
    relatedNodes = _.concat(relatedNodes, Nodes.find({ parentNodeId: { $in: _.map(relatedNodes, '_id') } }).fetch())
    relatedNodes = _.map(relatedNodes, node => {
      node.originalId = _.clone(node._id)
      node.originalParentNodeId = _.clone(node.parentNodeId)
      node._id = Random.id()
      return node
    })
    const relatedNodesKeyByNewId = _.keyBy(relatedNodes, '_id')
    const relatedNodesKeyByOriginalId = _.keyBy(relatedNodes, 'originalId')

    const nodes = _.map(relatedNodes, node => {
      node.rootId = id
      delete node.labels
      console.log('before', node)
      const {parentNodeId} = node
      // console.log(_.get(relatedNodesKeyByOriginalId, `${parentNodeId}`))
      if (_.get(relatedNodesKeyByOriginalId, `${parentNodeId}`)) {
        node.parentNodeId = _.get(relatedNodesKeyByOriginalId, `${parentNodeId}._id`)
      } else {
        node.parentNodeId = id
      }
      console.log('after', node)
      return node
    })
    // console.log(relatedNodes)
    // console.log(relatedNodesKeyBy)
    // console.log(nodes)
    return Nodes.batchInsert(nodes)
  },

  'dev.empty'() {
    return [Nodes.remove({}), Labels.remove({})]
  },

  'dev.remove'(_id) {
    return Nodes.remove({ $or: [{ _id }, { rootId: _id }] })
  },
})
