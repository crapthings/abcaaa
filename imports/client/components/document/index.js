import Textarea from 'react-textarea-autosize'

class List extends Component {
  state = {
    doc: {},
    paragraphs: [],
    currentSideId: null,
  }

  componentDidMount() {
    this.tracker = Tracker.autorun(() => {
      const doc = Documents.findOne(this.props._id)
      const paragraphs = Paragraphs.find({ documentId: doc._id }).fetch()
      this.setState({ doc, paragraphs })
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ currentSideId: nextProps.currentSideId })
  }

  componentWillUnmount() {
    this.tracker && this.tracker.stop()
  }

  onClick = ({ _id }) => evt => {
    this.props.changeSideId({ sideId: _id })
  }

  onClickAlt = ({ _id }) => evt => {
    this.props.changeSideId({ sideId: _id })
    this.refs.newline.focus()
  }

  onKeyUp = ({ _id, documentId }) => evt => {
    if (evt.shiftKey && evt.keyCode === 13) {
      evt.preventDefault()
      const content = _.trim(evt.target.value)
      if (!documentId || !content) return
      if (Paragraphs.findOne(_id)) {
        Meteor.call('paragraphs.update', _id, { content })
      } else {
        Meteor.call('paragraphs.create', { documentId, content })
      }
      return
    }

    if (evt.keyCode === 8 && _.isEmpty(evt.target.value)) {
      if (!Paragraphs.findOne(_id)) return
      Meteor.call('paragraphs.remove', _id, (err, resp) => {
        console.log(err, resp)
      })
    }
  }

  render() {
    const documentId = this.props.match.params._id
    const { doc, paragraphs, currentSideId } = this.state

    const list = [
      ...paragraphs,
      { _id: Random.id(), newline: true }
    ]

    return (
      list.map(({ _id, content, labels = [], newline }) => {
        if (newline === true) {
          return (
            <Textarea key={_id} rows='1' ref='newline' onKeyUp={this.onKeyUp({ _id, documentId })} />
          )
        } else {
          return (
            currentSideId == _id
            ? <Textarea className='active' key={_id} onClick={this.onClick({ _id })} onKeyUp={this.onKeyUp({ _id, documentId })} defaultValue={content} />
            : <Textarea key={_id} onClick={this.onClick({ _id })} onKeyUp={this.onKeyUp({ _id, documentId })} defaultValue={content} />
          )
        }
      })
    )
  }
}

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

class Side extends Component {
  state = { labels: [] }

  componentDidMount() {
    this.tracker = Tracker.autorun(() => {
      const paragraph = Paragraphs.findOne(this.props._id)
      const labels = _.get(paragraph, 'labels', [])
      this.setState({ labels })
    })
  }

  componentWillReceiveProps(nextProps) {
    this.tracker = Tracker.autorun(() => {
      const paragraph = Paragraphs.findOne(nextProps._id)
      const labels = _.get(paragraph, 'labels', [])
      this.setState({ labels })
    })
  }

  componentWillUnmount() {
    this.tracker && this.tracker.stop()
  }

  onSubmit = ({ _id }) => evt => {
    evt.preventDefault()
    const { value } = evt.target[0]
    const labels = value.split(' ')
    Meteor.call('paragraphs.update.labels', _id, { labels }, (err, resp) => {
      if (err) return
      this.refs.form.reset()
    })
  }

  render() {
    const { labels } = this.state
    const { _id } = this.props
    return (
      <div id='doc-side'>
        <h1>side</h1>
        {_.isArray(labels) && labels.map(label => <div key={label}>label: {label}</div>)}
        <form ref='form' onSubmit={this.onSubmit({ _id })}>
          标签: <input type='text' defaultValue={_.isArray(labels) && labels.join(' ')} />
        </form>
      </div>
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
