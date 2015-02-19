'use strict';

var React = require('react');

//react componets
var Page = require('./app/jsx/page.jsx');

React.initializeTouchEvents(true);

if (typeof window !== 'undefined') {
  window.onload = function() {
    React.renderComponent(Page(null), document);
  }
}