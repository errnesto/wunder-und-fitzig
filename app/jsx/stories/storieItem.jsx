/**
* @jsx React.DOM
*/
'use strict';

var React = require('react/addons');

var helpers    = require('../mixins.jsx');

var classSet = React.addons.classSet;

var StorieItem = React.createClass({
	mixins: [helpers],
	//animations
	componentWillEnter: function (callback) {
		//first position left or right from screen
		var nextClass = this.props.getSlideDirection().next;
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
			var prevClass = this.props.getSlideDirection().prev;
			this.switchClass('active',prevClass);
		}.bind(this),17);

		this.prefixedEvent(this.getDOMNode(),'transitionEnd',callback);
	},


	render: function() {
		var classNames = classSet({
			'storie-item'   : true,
			'active'        : true,
			'invalid-left'  : this.props.invalid == 'prev'
		});

		var style      = {
			'background-image':  'url(/assets/img/stories/'+this.props.background+')',
			'transform':         'translateX(' + this.props.translateX + 'px)',
			'-webkit-transform': 'translateX(' + this.props.translateX + 'px)'
		};
		var CoverImg;

		if (this.props.isCover) {
			style    = {
				'background':        this.props.background,
				'background-size':   this.props.backgroundSize,
				'transform':         'translateX(' + this.props.translateX + 'px)',
				'-webkit-transform': 'translateX(' + this.props.translateX + 'px)'
			};
			CoverImg = (
				<img 
					className = "cover-image" 
					src       = {'/assets/img/stories/'+this.props.cover} />
			);
		}

		if (this.props.translateX !== 0) {
			style.transition = '0s';
		}

		return (
			<div 
				className = {classNames} 
				style     = {style}>
				{CoverImg}
			</div>
		);
	}
});

module.exports = StorieItem;