import '/imports/server'

Meteor.startup(function () {
  const initId = '2GyEteBcPnuTDqRGD'
  const test1 = Nodes.find({ _id: initId }).fetch()
  const ids = _.map(test1, '_id')
  const nodes = findChildrenNodes(ids, [])
  console.log(nodes)
})

function findChildrenNodes(ids, nodes = []) {
  const _nodes = Nodes.find({ parentNodeId: { $in: ids } }).fetch()
  const _ids = _.map(_nodes, '_id')
  return _ids.length ? findChildrenNodes(_ids, _.concat(nodes, _nodes)) : nodes
}