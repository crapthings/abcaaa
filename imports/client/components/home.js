const tracker = (props, onData) => {
  const ready = Meteor.subscribe('nodes.isRoot').ready()
  if (!ready) return
  const nodes = Nodes.find({ isRoot: true }).fetch()
  onData(null, { nodes })
}

const CreateText = () => {
  return (
    <div id='CreateText'>
      <h1>hi</h1>
      <form onSubmit={evt => {
        evt.preventDefault()
        const text = evt.target[0].value
        Meteor.call('nodes.create.parse', { text })
      }}>
        <textarea></textarea>
        <input type="submit"/>
      </form>
    </div>
  )
}

const CreateDocumentBtn = () => (
  <button
    onClick={() => {
      const content = prompt()
      if (!content) return
      Meteor.call('nodes.create.isRoot', { content })
    }}
  >创建文档</button>
)

const EmptyDocumentBtn = () => <button onClick={() => Meteor.call('dev.empty')}>dev empty</button>

class DocumentList extends Component {
  render() {
    return (
      this.props.nodes.map(({ _id, content }) => (
        <div key={_id}>
          <a href='#' onClick={evt => {
            evt.preventDefault()
            this.props.history.push(`/nodes/${_id}`)
          }}>{content}</a>
        </div>
      ))
    )
  }
}

const DocumentsContainer = withTracker(tracker)(DocumentList)

export default props => <div>
  <h1>home</h1>
  <CreateText />
  <CreateDocumentBtn/>
  <EmptyDocumentBtn/>
  <DocumentsContainer {...props}/>
</div>
