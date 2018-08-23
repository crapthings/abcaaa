// import SortableTree from '/imports/tree'
import SortableTree, {
  getTreeFromFlatData,
  addNodeUnderParent,
  removeNodeAtPath,
  removeNode,
} from 'react-sortable-tree'

const tracker = (props, onData) => {
  const { _id } = props
  const currentSideId = _.get(props, 'location.state.currentParagraphId')
  const flatData = Nodes.find({}, { sort: { order: 1 } }).map(item => {
    item.title = item.content
    item.subtitle = item._id
    return item
  })
  const nodes = getTreeFromFlatData({
    flatData,
    getKey: node => node._id,
    getParentKey: node => node.parentNodeId || 'root',
    rootKey: 'root'
  })
  onData(null, { _id, nodes, currentSideId })
}

class Tree extends Component {
  onVisibilityToggle = ({ node, expanded }) => {
    Meteor.call('nodes.update.expanded', node._id, { expanded })
  }

  onMoveNode = ({ treeData, node, nextParentNode, prevPath, prevTreeIndex, nextPath, nextTreeIndex }) => {
    if (_.isEqual(prevPath, nextPath)) return
    const prevNode = _.get(nextParentNode, `children.${nextTreeIndex - 1 - 1}`)
    const nextNode = _.get(nextParentNode, `children.${nextTreeIndex}`)
    console.log('treeData', treeData)
    console.log('node', node)
    console.log('nextParentNode', nextParentNode)
    console.log('prevPath', prevPath)
    console.log('prevTreeIndex', prevTreeIndex)
    console.log('nextPath', nextPath)
    console.log('nextTreeIndex', nextTreeIndex)
    console.log('prevNode', prevNode)
    console.log('nextNode', nextNode)
    if (nextParentNode) {
      let order
      if (prevNode && nextNode) {
        console.log(1)
        order = _.random(prevNode.order, nextNode.order, true)
      }
      if (!prevNode && nextNode)
        order = _.random(nextNode.order, true)
      if (!nextNode && prevNode)
        order = Date.now()
      // console.log(order)
      const parentNodeId = nextParentNode._id
      Meteor.call('nodes.update.parent', node._id, { order, parentNodeId })
    }
  }

  render() {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', }}>
        <SortableTree
          onMoveNode={this.onMoveNode}
          style={{ flex: 1 }}
          onVisibilityToggle={this.onVisibilityToggle}
          isVirtualized={true}
          treeData={this.props.nodes}
          onChange={_.noop}
          generateNodeProps={rowInfo => {
            if (rowInfo.node.isRoot) {
              return {
                buttons: [
                  <button className='btn btn-outline-success' style={{ verticalAlign: 'middle' }}
                    onClick={() => {
                      const rootId = this.props._id
                      const parentNodeId = rowInfo.node._id
                      const content = prompt('输入内容')
                      Meteor.call('nodes.create', { rootId, parentNodeId, content })
                    }}
                  >
                    + child
                  </button>
                ],
              }
            } else {
              return {
                buttons: [
                  (
                    <button className='btn btn-outline-success' style={{ verticalAlign: 'middle', }}
                      onClick={() => {
                        if (rowInfo.parentNode) {
                          const rootId = this.props._id
                          const parentNodeId = rowInfo.parentNode._id
                          const content = prompt('输入内容')
                          Meteor.call('nodes.create', { rootId, parentNodeId, content })
                        } else {
                          const rootId = this.props._id
                          const parentNodeId = rowInfo.node._id
                          const content = prompt('输入内容')
                          Meteor.call('nodes.create', { rootId, parentNodeId, content })
                        }
                      }}
                    >+ next</button>
                  ), (
                    <button className='btn btn-outline-success' style={{ verticalAlign: 'middle' }}
                      onClick={() => {
                        const rootId = this.props._id
                        const parentNodeId = rowInfo.node._id
                        const content = prompt('输入内容')
                        Meteor.call('nodes.create', { rootId, parentNodeId, content })
                      }}
                    >+ child</button>
                  ), !rowInfo.node.children && (
                    <button className='btn btn-outline-success' style={{ verticalAlign: 'middle' }}
                      onClick={() => {
                        Meteor.call('nodes.remove', rowInfo.node._id)
                      }}
                    >x remove</button>
                  )

                ],
              }
            }
          }}
        />
      </div>
    )
  }
}

export default withTracker(tracker)(Tree)
