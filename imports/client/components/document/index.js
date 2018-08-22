import List from './paragraphs'
import Side from './side'

class HeadForm extends Component {
  onSubmit = ({ _id }) => evt => {
    evt.preventDefault()
    const title = _.trim(evt.target[0].value)
    if (!title) return
    const labels = _.trim(evt.target[1].value).split(' ')
    Meteor.call('documents.update', _id, { title, labels })
  }

  render() {
    const { doc } = this.props
    const { _id, title, labels } = doc
    return (
      <form onSubmit={this.onSubmit({ _id })}>
        <div>
          <input type='text' defaultValue={title} />
        </div>

        <div>
          <input type='text' defaultValue={_.isArray(labels) ? labels.join(' ') : ''} />
        </div>

        <div>
          <input type='submit' />
        </div>
      </form>
    )
  }
}

class DocumentHead extends Component {
  state = { doc: {}, openForm: false }

  componentDidMount() {
    this.tracker = Tracker.autorun(() => {
      const doc = Documents.findOne(this.props._id)
      this.setState({ doc })
    })
  }

  componentWillUnmount() {
    this.tracker && this.tracker.stop()
  }

  openForm = () => {
    this.setState({ openForm: true })
  }

  render() {
    const { doc, openForm } = this.state
    return (
      <Fragment>
      {openForm && <HeadForm doc={doc} />}
      <h1 onClick={this.openForm}>{doc.title}</h1>
      </Fragment>
    )
  }
}

class DocumentComponent extends Component {
  state = {
    sideId: null,
  }

  changeSideId = ({ sideId }) => this.setState({ sideId })

  render() {
    const { sideId } = this.state
    const { _id } = this.props.match.params

    return (
      <div  style={{ display: 'flex' }}>
        <div id='doc-body'>
          <DocumentHead _id={_id} />
          <List {...this.props} _id={_id} changeSideId={this.changeSideId} currentSideId={sideId} />
        </div>
        {sideId && <Side _id={sideId}/>}
      </div>
    )
  }
}

const DocumentTracker = (props, onData) => {
  const { _id } = props.match.params
  const ready = Meteor.subscribe('document', _id).ready()
  if (!ready) return
  onData(null, {})
}

const DocumentContainer = withTracker(DocumentTracker)(DocumentComponent)

export default props => <DocumentContainer {...props} />
