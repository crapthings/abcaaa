const tracker = (props, onData) => {
  const paragraph = Paragraphs.findOne(props._id)
  const labels = _.get(paragraph, 'labels', [])
  onData(null, { paragraph, labels })
}

class comp extends Component {
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
    const { _id, labels } = this.props
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

export default withTracker(tracker)(comp)
