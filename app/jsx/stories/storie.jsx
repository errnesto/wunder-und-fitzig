/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var StorieItem = require('./storieItem.jsx');
var helpers    = require('../mixins.jsx');

var classSet                = React.addons.classSet;
var ReactTransitionGroup    = React.addons.TransitionGroup;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Storie = React.createClass({
	mixins: [helpers],
	//animations
	componentWillEnter: function (callback) {
		//first position for scroll down or up animation
		var nextClass = this.props.getSwitchDirection().next;
		this.switchClass('active',nextClass);

		//then after 17 seconds move to center (timeout necessary to trigger animation)
		window.setTimeout(function () {
			this.switchClass(nextClass,'active');
			callback();
		}.bind(this),17);
	},

	componentWillLeave: function (callback) {
		//in timeout to keep animations in sync
		window.setTimeout(function () {
			var prevClass = this.props.getSwitchDirection().prev;
			this.switchClass('active',prevClass);
		}.bind(this),17);

		// callback removes element when transion is finsihed
		this.prefixedEvent(this.getDOMNode(),'transitionEnd',callback);
	},

	//render
	render: function() {
		var classNames = classSet({
			'storie'       : true,
			'active'       : true,
			'invalid-up'   : this.props.invalid == 'up',
			'invalid-down' : this.props.invalid == 'down'
		});
		var currentItem = this.props.items[this.props.currentItem];

		return (
			<div 
				className = {classNames}
				style     = {{transform: 'translateY(' + this.props.translate.y + 'px)'}}>
				<ReactTransitionGroup>
					<StorieItem 
						key               = {this.props.customer+'-'+this.props.currentItem} 
						invalid           = {this.props.invalid}
						getSlideDirection = {this.props.getSlideDirection}
						isCover           = {currentItem.is_cover} 
						background        = {currentItem.background} 
						backgroundSize    = {currentItem.backgroundSize}
						cover             = {currentItem.cover}
						translateX        = {this.props.translate.x}
					/>
				</ReactTransitionGroup>

				<div 
					className="inner-storie">
					<h2 
						className="storie-title">
						{this.props.customer}
					</h2>

					<ReactCSSTransitionGroup 
						transitionName="flip">
						<div 
							className = "storie-text-wrapper" 
							key       = {'text'+this.props.currentItem} >
							<p 
								className               = "storie-text" 
								dangerouslySetInnerHTML = {{__html: this.props.items[this.props.currentItem].text}} 
							/>
						</div>
					</ReactCSSTransitionGroup>
					
					{this.props.currentItem === 0 ? '' : <a className="prev arrow" href = "prev" onClick={this.props.handleLink}>prev</a>}
					<a 
						className = "next arrow" 
						href      = "next"
						onClick   = {this.props.handleLink}>
						next
					</a>
				</div>
			</div>
		);
	}
});

module.exports = Storie;