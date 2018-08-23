import List from './paragraphs'
import Side from './side'
import DocumentHead from './head'
import Tree from './tree'

class DocumentComponent extends Component {
  render() {
    const { _id, sideId } = this.props
    return (
      <Fragment>
        <Tree _id={_id} />
        {sideId && <Side _id={sideId}/>}
      </Fragment>
    )
  }
}

const DocumentTracker = (props, onData) => {
  const { _id } = props.match.params
  const sideId = _.get(props, 'location.state.currentParagraphId')
  const ready = Meteor.subscribe('nodes', _id).ready()
  if (!ready) return
  onData(null, { _id, sideId })
}

const DocumentContainer = withTracker(DocumentTracker)(DocumentComponent)

export default props => <DocumentContainer {...props} />
