/**
* @jsx React.DOM
*/
'use strict';

var React   = require('react/addons');
var request = require('superagent');

var Storie = require('./storie.jsx');

var ReactTransitionGroup = React.addons.TransitionGroup;

var StoriesContainer = React.createClass({
	getInitialState: function() {
		return {
			stories:       [],
			currentStorie: 0,
			recentStorie:  0,

			currentItems:  [],
			recentItems:   [],

			invalid:       false,
			touchOffset:   {
				x: 0, 
				y: 0
			}
		};
	},

	componentWillMount: function () {
		this.xScrollOffset  = 0;
		this.yScrollOffset  = 0;

		this.scrollLock     = false;
		this.animationQueue = [];
	},

	componentDidMount: function() {
		//get stories from Server
		request
			.get('/assets/data/stories.json')

			.end(function(res){
				var stories = res.body;
				this.shuffle(stories);

				this.setState({
					stories: stories,
				});
			}.bind(this));

		window.addEventListener('keydown', this.handleKey);
	},

	// Fisher-Yates shuffle algorithm
	// from: http://stackoverflow.com/a/12646864/3181404
	shuffle: function (array) {
		for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  	}
  	return array;
	},

	// event handlers:
	handleWheel: function (e) {
		e.preventDefault();
		var THRESHOLD = 50;

		this.xScrollOffset += e.deltaX;
		this.yScrollOffset += e.deltaY;

		if (this.yScrollOffset > THRESHOLD) {
			this.switchStorie('down');
			this.yScrollOffset = 0;
		} else if (this.yScrollOffset < -THRESHOLD) {
			this.switchStorie('up');
			this.yScrollOffset = 0;

		} else if (this.xScrollOffset > THRESHOLD) {
			this.slide('next');
			this.xScrollOffset = 0;
		} else if (this.xScrollOffset < -THRESHOLD) {
			this.slide('prev');
			this.xScrollOffset = 0;
		}
	},

	hanldeTouchStart: function (e) {
		this.touchStartX = e.touches[0].clientX;
		this.touchStartY = e.touches[0].clientY;
	},

	handleTouchMove: function (e) {
		this.setState({
			touchOffset: {
				x: this.state.touchOffset.x + e.touches[0].clientX - this.touchStartX,
				y: this.state.touchOffset.y + e.touches[0].clientY - this.touchStartY
			}
		});
	},

	handleTouchEnd: function (e) {
		var THRESHOLD = 50;
		var yOffset = this.state.touchOffset.y;
		var xOffset = this.state.touchOffset.x;

		this.setState({
			touchOffset: {
				x: 0,
				y: 0
			}
		}, function () {
			if (yOffset < -THRESHOLD) {
				this.switchStorie('down');
			} else if (yOffset > THRESHOLD) {
				this.switchStorie('up');
			} else if (xOffset > THRESHOLD) {
				this.slide('prev');
			} else if (xOffset < -THRESHOLD) {
				this.slide('next');
			}
		});
	},

	handleKey: function (e) {
		switch (e.keyCode) {
			case 39:
				if (!this.slide('next')) this.animationQueue.push('next');
				break;
			case 37:
				if (!this.slide('prev')) this.animationQueue.push('prev');
				break;
			case 38:
				if (!this.switchStorie('up')) this.animationQueue.push('up');
				break;
			case 40:
				if (!this.switchStorie('down')) this.animationQueue.push('down');
				break;
		}
	},

	handleLink: function (e) {
		e.preventDefault();
		var href = e.target.getAttribute('href');
		this.slide(href);
	},

	slide: function (direction) {
		if(!this.scrollLock) {
			var tempCurrentItems = this.state.currentItems,
			tempRecentItems      = this.state.recentItems,
			numberOfItems        = this.state.stories[this.state.currentStorie].items.length,
			currentItem          = tempCurrentItems[this.state.currentStorie] || 0,
			recentItem           = currentItem;

			if (direction == 'next') currentItem ++;
			if (direction == 'prev') currentItem --;

			if (currentItem > numberOfItems -1) currentItem = 0;

			if (currentItem >= 0) {
				this.scrollLock = true;

				tempCurrentItems[this.state.currentStorie] = currentItem;
				tempRecentItems[this.state.currentStorie]  = recentItem;

				this.setState({
					currentItems: tempCurrentItems,
					recentItems:  tempRecentItems
				});

				this.checkAnimationQueue();
			} else {
				this.setInvalid(direction);
			}
			return true;
		}
		return false;
	},

	getSlideDirection: function () {
		var currentItem = this.state.currentItems[this.state.currentStorie],
		recentItem      = this.state.recentItems[this.state.currentStorie];

		var directions = {next: 'right', prev: 'left'};
		if (recentItem > currentItem) {
			//slide back
			directions = {next: 'left', prev: 'right'};
		}

		return directions;
	},

	switchStorie: function (direction) {
		if(!this.scrollLock) {

			var newStorie = this.state.currentStorie + 1;
			if (direction == 'up') newStorie = this.state.currentStorie - 1;

			if (newStorie >= 0 && newStorie <= this.state.stories.length-1) {
				this.scrollLock = true;

				this.setState({
					currentStorie: newStorie,
					recentStorie:  this.state.currentStorie,
				});

				this.checkAnimationQueue();				
			} else {
				this.setInvalid(direction);
			}
			return true;
		}
		return false;
	},

	getSwitchDirection: function () {
		var directions = {next: 'down', prev: 'up'};
		if (this.state.recentStorie > this.state.currentStorie) {
			//slide up
			directions = {next: 'up', prev: 'down'};
		}
		return directions;
	},

	checkAnimationQueue: function () {
		window.setTimeout(function(){
			// allow other animations 
			this.scrollLock = false;
			// check for pending animations
			var queueHasItems = this.animationQueue.length > 0;

			if (queueHasItems) {
				//next in queue equals next or prev
				var isNextPrevAction = ['next','prev'].indexOf(this.animationQueue[0]) >= 0;
				if (isNextPrevAction) {
					this.slide(this.animationQueue.shift());
				} else {
					//must be upDownAction
					this.switchStorie(this.animationQueue.shift());
				}
				
			}
		}.bind(this),1250); //animation duration from css + 50ms safety
	},

	setInvalid: function (direction) {
		this.setState({invalid: direction});
		window.setTimeout(function(){
			this.setState({invalid: false});
		}.bind(this),500);
	},
	
	render: function() {

		var StorieElem = {};
		var storieData = this.state.stories[this.state.currentStorie];

		if (storieData) {
			StorieElem = (
				<Storie
					key                = {'story'+this.state.currentStorie}
					items              = {storieData.items}
					customer           = {storieData.customer}
					currentItem        = {this.state.currentItems[this.state.currentStorie] || 0}
					invalid            = {this.state.invalid}
					handleLink         = {this.handleLink}
					getSlideDirection  = {this.getSlideDirection}
					getSwitchDirection = {this.getSwitchDirection}
					translate          = {this.state.touchOffset}
				/>
			);
		}

		return (
			<section 
				className    = "stories-container" 
				onWheel      = {this.handleWheel}
				onTouchStart = {this.hanldeTouchStart}
				onTouchMove  = {this.handleTouchMove}
				onTouchEnd   = {this.handleTouchEnd}>
				<ReactTransitionGroup>
					{StorieElem}
				</ReactTransitionGroup>
			</section>
		);
	}
});

module.exports = StoriesContainer;