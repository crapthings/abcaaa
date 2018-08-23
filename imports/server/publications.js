Meteor.publish('nodes.isRoot', function () {
  return Nodes.find({ isRoot: true })
})

Meteor.publish('nodes', function (_id) {
  return Nodes.find(
    { $or: [{ _id }, { rootId: _id }, { parentNodeId: _id }] },
    { sort: { order: 1 } }
  )
})
