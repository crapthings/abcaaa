const Nav = ({ history }) => {
  return (
    <ul>
      <li><a href='#' onClick={() => history.push('/')}>Home</a></li>
    </ul>
  )
}

export default children => props => (
  <div>
    <Nav {...props} />
    <div>
      {children(props)}
    </div>
  </div>
)
