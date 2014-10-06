/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react');
var ReactRouter = require('react-router-component');

var Link        = ReactRouter.Link;

var NavLink = React.createClass({


  isActive: function() {
    return this.props.currentPath === this.props.href
  },

  render: function() {
    var className;
    if (this.isActive()) {
      className = 'active'
    }

    var link = (
      <Link
        className = {className}>
        {this.props.children}
      </Link>
    );

    return this.transferPropsTo(link)
  }
})

module.exports = NavLink;