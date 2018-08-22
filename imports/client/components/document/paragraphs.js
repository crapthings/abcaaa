import Textarea from 'react-textarea-autosize'

const tracker = (props, onData) => {
  const { _id, currentSideId } = props
  const doc = Documents.findOne(_id)
  const paragraphs = Paragraphs.find({ documentId: _id }).fetch()
  console.log('tracker', props)
  onData(null, { _id, doc, paragraphs, currentSideId })
}

class comp extends Component {
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
    const documentId = this.props._id
    const { doc, paragraphs, currentSideId } = this.props

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

export default withTracker(tracker)(comp)
