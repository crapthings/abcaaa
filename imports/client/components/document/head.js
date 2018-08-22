const tracker = (props, onData) => {
  const doc = Documents.findOne(props._id)
  onData(null, { doc })
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

class comp extends Component {
  state = { openForm: false }


  openForm = () => {
    this.setState({ openForm: true })
  }

  render() {
    const { openForm } = this.state
    const { doc } = this.props
    return (
      <Fragment>
      {openForm && <HeadForm doc={doc} />}
      <h1 onClick={this.openForm}>{doc.title}</h1>
      </Fragment>
    )
  }
}

const Container = withTracker(tracker)(comp)

export default Container
