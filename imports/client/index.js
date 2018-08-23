import { render } from 'react-dom'
import Routes from './routes'

Meteor.startup(function () {
  render(<Routes/>, createElement('div'))
})

function createElement (tag) {
  const div = document.createElement('div')
  document.body.appendChild(div)
  div.id = 'wrapper'
  return div
}