const Nav = ({ history }) => {
  return (
    <ul>
      <li><a href='#' onClick={evt => evt.preventDefault() || history.push('/')}>Home</a></li>
    </ul>
  )
}

export default children => props => (
  <div id='layout' >
    <Nav {...props} />
    <div id='main'>
      {children(props)}
    </div>
  </div>
)
