const tracker = (props, onData) => {
  const ready = Meteor.subscribe('documents').ready()
  if (!ready) return
  const documents = Documents.find().fetch()
  onData(null, { documents })
}

const CreateDocumentBtn = () => (
  <button
    onClick={() => {
      const title = prompt()
      if (!title) return
      Meteor.call('documents.create', { title })
    }}
  >创建文档</button>
)

const EmptyDocumentBtn = () => <button onClick={() => Meteor.call('dev.documents.empty')}>dev empty documents</button>

class DocumentList extends Component {
  render() {
    return (
      this.props.documents.map(({ _id, title }) => (
        <div key={_id}>
          <a href='#' onClick={evt => {
            evt.preventDefault()
            this.props.history.push(`/documents/${_id}`)
          }}>{title}</a>
        </div>
      ))
    )
  }
}

const DocumentsContainer = withTracker(tracker)(DocumentList)

export default props => <div>
  <h1>home</h1>
  <CreateDocumentBtn/>
  <EmptyDocumentBtn/>
  <DocumentsContainer {...props}/>
</div>
