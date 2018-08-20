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
  state = {
    documents: [],
  }

  componentDidMount() {
    this.tracker = Tracker.autorun(() => {
      const ready = Meteor.subscribe('documents').ready()
      if (!ready) return
      const documents = Documents.find().fetch()
      this.setState({ documents })
    })
  }

  render() {
    return (
      this.state.documents.map(({ _id, title }) => (
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

export default props => <div>
  <h1>home</h1>
  <CreateDocumentBtn/>
  <EmptyDocumentBtn/>
  <DocumentList {...props}/>
</div>