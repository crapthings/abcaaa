_ = require('lodash')
moment = require('moment')
React = require('react')
Component = React.Component
Fragment = React.Fragment
withTracker = require('@crapthings/meteor-rekomposer').default.withTracker

Documents = new Mongo.Collection('documents')
Paragraphs = new Mongo.Collection('paragraphs')
