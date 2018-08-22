_ = require('lodash')
moment = require('moment')
React = require('react')
Component = React.Component
Fragment = React.Fragment
import rk from '/imports/a'
withTracker = rk.withTracker

Documents = new Mongo.Collection('documents')
Paragraphs = new Mongo.Collection('paragraphs')
