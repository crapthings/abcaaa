import Textarea from 'react-textarea-autosize'

class List extends Component {
  state = {
    doc: {},
    paragraphs: [],
  }

  componentDidMount() {
    const { _id } = this.props.match.params
    this.tracker = Tracker.autorun(() => {
      const ready = Meteor.subscribe('document', _id).ready()
      if (!ready) return
      const doc = Documents.findOne(_id)
      const paragraphs = Paragraphs.find({ documentId: _id }).fetch()
      this.setState({ doc, paragraphs })
    })
  }

  onKeyUp = ({ _id }) => evt => {
    if (evt.shiftKey && evt.keyCode === 13) {
      evt.preventDefault()
      const documentId = _id
      const content = _.trim(evt.target.value)
      if (!documentId || !content) return
      Meteor.call('paragraphs.create', { documentId, content })
    }

    if (evt.keyCode === 8 && _.isEmpty(evt.target.value)) {
      if (!Paragraphs.findOne(_id)) return
      Meteor.call('paragraphs.remove', _id, (err, resp) => {
        console.log(err, resp)
      })
    }
  }

  render() {
    const { doc, paragraphs } = this.state

    const list = [
      ...paragraphs,
      { _id: Random.id(), newline: true }
    ]

    return (
      list.map(({ _id, content, newline }) => (
        newline === true
        ? <Textarea key={_id} rows='1' onKeyUp={this.onKeyUp({ _id })} autoFocus />
        : <Textarea key={_id} onKeyUp={this.onKeyUp({ _id })} defaultValue={content} />
      ))
    )
  }
}

export default props => <div>
  <h1>Document</h1>
  <List {...props}/>
</div>