/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react');
var ReactRouter = require('react-router-component');
// var superagent  = require('superagent');

//react componets
var NewsPage = require('./app/js/news/newsPage.jsx');

var Pages       = ReactRouter.Pages;
var Page        = ReactRouter.Page;
var NotFound    = ReactRouter.NotFound;
var Link        = ReactRouter.Link;

var Conatiner = React.createClass({

  render: function () {
    return (
      <html lang="de">
      <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

          <title>wunder &amp; fitzig | Werbeagentur Berlin</title>

          <link rel="stylesheet" href="assets/css/main.css" />

          <script src="assets/js/main.js"></script>
      </head>

      <body>
        <header className="blackHeader">
        <nav className="topNavigation">
          <ul>
            <li className=" menu-item">
              <a href="creatives">
                <img className="menu-img" src="assets/img/creatives.svg" alt="creatives" />
              </a>
            </li>
            <li className="active menu-item">
              <a href="./">
                <img className="menu-logo" src="assets/img/logo.svg" alt="wunder &amp; fitzig" />
              </a>
            </li>
            
            <li className=" menu-item">
              <a href="stories">
                <img className="menu-img" src="assets/img/stories.svg" alt="stories" />
              </a>
            </li>
          </ul>
        </nav>
      </header>

        <div className="content">
          <Pages className="App" path={this.props.path || '/'}>
            <Page path="/" handler={NewsPage} />
          </Pages>
        </div>
      </body>
      </html>
    );
  }
});

module.exports = Conatiner;

if (typeof window !== 'undefined') {
  window.onload = function() {
    React.renderComponent(Conatiner(), document);
  }
}