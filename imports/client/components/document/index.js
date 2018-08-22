import List from './paragraphs'
import Side from './side'
import DocumentHead from './head'

class DocumentComponent extends Component {
  render() {
    const { _id, sideId } = this.props

    return (
      <div  style={{ display: 'flex' }}>
        <div id='doc-body'>
          {<DocumentHead _id={_id} />}
          <List {...this.props} _id={_id} currentSideId={sideId} />
        </div>
        {sideId && <Side _id={sideId}/>}
      </div>
    )
  }
}

const DocumentTracker = (props, onData) => {
  const { _id } = props.match.params
  const sideId = _.get(props, 'location.state.currentParagraphId')
  const ready = Meteor.subscribe('document', _id).ready()
  if (!ready) return
  onData(null, { _id, sideId })
}

const DocumentContainer = withTracker(DocumentTracker)(DocumentComponent)

export default props => <DocumentContainer {...props} />
