/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react');
var ReactRouter = require('react-router-component');

//react componets
var NavLink  = require('./navLink.jsx');

var NewsPage = require('./news/newsPage.jsx');
var Stories  = require('./stories/storiesContainer.jsx');

var Locations   = ReactRouter.Locations;
var Location    = ReactRouter.Location;
var NotFound    = ReactRouter.NotFound;

var Test = React.createClass({
  render: function () {
    return <h1>test</h1>;
  }
});

var Conatiner = React.createClass({
  mixins: [ReactRouter.NavigatableMixin],

  getInitialState: function () {
    return {
      currentPage: '/'
    };
  },

  handleNavigation: function () {
    this.setState({
      currentPage: this.getPath()
    });
  },

  getTitleString: function () {
    switch (this.state.currentPage) {
      case '/creatives':
        return 'Creatives';
      case '/stories':
        return 'Stories';
      default:
        return 'Werbeagentur Berlin';
    }
  },

  render: function () {
    return (
      <html 
        lang = "de">
      <head>
          <meta 
            charSet = "UTF-8" />
          <meta 
            name    = "viewport" 
            content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

          <title>{'wunder & fitzig | ' + this.getTitleString()}</title>

          <link 
            rel  = "stylesheet" 
            href = "assets/css/main.css" />

          <script 
            src = "assets/js/main.js" />
      </head>

      <body>
        <header 
          className = "blackHeader">
        <nav 
          className = "topNavigation">
          <ul>
            <li 
              className = " menu-item">
              <NavLink 
                href        = "/creatives"
                currentPath = {this.state.currentPage} >
                <img 
                  className = "menu-img" 
                  src       = "assets/img/creatives.svg" 
                  alt       = "creatives" />
              </NavLink>
            </li>
            <li 
              className = "active menu-item">
              <NavLink 
                href        = "/"
                currentPath = {this.state.currentPage} >
                <img 
                  className = "menu-logo" 
                  src       = "assets/img/logo.svg" 
                  alt       = "wunder &amp; fitzig" />
              </NavLink>
            </li>
            
            <li 
              className = " menu-item">
              <NavLink 
                href        = "/stories"
                currentPath = {this.state.currentPage} >
                <img 
                  className = "menu-img" 
                  src       = "assets/img/stories.svg" 
                  alt       = "stories" />
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

        <div className="content">
          <Locations 
            className    = "App" 
            path         = {this.props.path}
            onNavigation = {this.handleNavigation}>

            <Location 
              path    = "/" 
              handler = {NewsPage} />
            <Location 
              path    = "/stories" 
              handler = {Stories} />
            <Location 
              path    = "creatives" 
              handler = {Test} />
            <NotFound
              handler = {Test} />
          </Locations>
        </div>
      </body>
      </html>
    );
  }
});

module.exports = Conatiner;