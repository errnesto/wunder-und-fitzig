var StoriesContainer = React.createClass({
	getInitialState: function() {
		return {
			stories:       [],
			currentStorie: 0,
			recentStorie:  0,

			currentItems:  [],
			recentItems:   [],

			scrollOffset:  [0,0],
			scrollLock:    false,
			animationQueue:  []
		};
	},

	componentDidMount: function() {
		//get stories from Server
		request
			.get(this.props.url)

			.end(function(res){
				this.setState({
					stories: res.body,
				});
			}.bind(this));

		window.addEventListener('keydown', this.handleKey);
	},

	// event handlers:
	handleWheel: function (e) {
		e.preventDefault();
		var THRESHOLD = 50;

		var xScrollOffset = this.state.scrollOffset[0] + e.deltaX;
		var yScrollOffset = this.state.scrollOffset[1] + e.deltaY;

		this.setState({
			scrollOffset: [xScrollOffset,yScrollOffset]
		});

		if (yScrollOffset > THRESHOLD) {
			this.switchStorie('down');
			this.setState({scrollOffset: [0,0]});
		} else if (yScrollOffset < -THRESHOLD) {
			this.switchStorie('up');
			this.setState({scrollOffset: [0,0]});

		} else if (xScrollOffset > THRESHOLD) {
			this.slide('next');
			this.setState({scrollOffset: [0,0]});
		} else if (xScrollOffset < -THRESHOLD) {
			this.slide('prev');
			this.setState({scrollOffset: [0,0]});
		}

	},
	handleKey: function (e) {
		var q = this.state.animationQueue;

		switch (e.keyCode) {
			case 39:
				if (!this.slide('next')) q.push('next');
				break;
			case 37:
				if (!this.slide('prev')) q.push('prev');
				break;
			case 38:
				if (!this.switchStorie('up')) q.push('up');
				break;
			case 40:
				if (!this.switchStorie('down')) q.push('down');
				break;
		}

		this.setState({animationQueue: q});
	},
	handleLink: function (e) {
		e.preventDefault();
		var href = e.target.getAttribute('href');
		this.slide(href);
	},

	slide: function (direction) {
		if(!this.state.scrollLock) {
			var tempCurrentItems = this.state.currentItems,
			tempRecentItems      = this.state.recentItems,
			numberOfItems        = this.state.stories[this.state.currentStorie].items.length,
			currentItem          = tempCurrentItems[this.state.currentStorie] || 0,
			recentItem           = currentItem;

			if (direction == 'next') currentItem ++;
			if (direction == 'prev') currentItem --;

			if (currentItem > numberOfItems -1) currentItem = 0;

			if (currentItem >= 0) {
				tempCurrentItems[this.state.currentStorie] = currentItem;
				tempRecentItems[this.state.currentStorie]  = recentItem;

				this.setState({
					currentItems: tempCurrentItems,
					recentItems:  tempRecentItems,
					scrollLock:   true
				});

				this.checkAnimationQueue();
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
		if(!this.state.scrollLock) {
			var newStorie = this.state.currentStorie + 1;
			if (direction == 'up') newStorie = this.state.currentStorie - 1;

			if (newStorie >= 0 && newStorie <= this.state.stories.length-1) {
				this.setState({
					currentStorie: newStorie,
					recentStorie:  this.state.currentStorie,
					scrollLock:    true
				});

			this.checkAnimationQueue();				
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
			//allow new action when animation is finished
			this.setState({scrollLock: false});

			var queueHasItems = this.state.animationQueue.length > 0;

			if (queueHasItems) {
				var isNextPrevAction = ['next','prev'].indexOf(this.state.animationQueue[0]) >= 0;
				if (isNextPrevAction) {
					this.slide(this.state.animationQueue.shift());
				} else {
					//must be upDownAction
					this.switchStorie(this.state.animationQueue.shift());
				}
				
			}
		}.bind(this),1250); //animation duration from css + 50ms safety
	},
	
	render: function() {

		var ReactTransitionGroup = React.addons.TransitionGroup;

		var StorieElem = {};
		var storieData = this.state.stories[this.state.currentStorie];

		if (storieData) {
			StorieElem = (
				<Storie
					key                = {'story'+this.state.currentStorie}
					items              = {storieData.items}
					customer           = {storieData.customer}
					currentItem        = {this.state.currentItems[this.state.currentStorie] || 0}
					handleLink         = {this.handleLink}
					getSlideDirection  = {this.getSlideDirection}
					getSwitchDirection = {this.getSwitchDirection}
				/>
			);
		}

		return (
			<section 
				className = "stories-container" 
				onWheel   = {this.handleWheel}>
				<ReactTransitionGroup>
					{StorieElem}
				</ReactTransitionGroup>
			</section>
		);
	}
});