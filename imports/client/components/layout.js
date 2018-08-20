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
    {children(props)}
  </div>
)