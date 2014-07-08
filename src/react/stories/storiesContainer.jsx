var StoriesContainer = React.createClass({
	getInitialState: function() {
		return {
			stories: [],
			currentStorie: 0,
			recentStorie: 0,

			currentItems: [],
			recentItems: [],

			scrollOffset: [0,0],
			scrollLock: false
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

		if (!this.state.scrollLock) {
			var xScrollOffset = this.state.scrollOffset[0] + e.deltaX;
			var yScrollOffset = this.state.scrollOffset[1] + e.deltaY;

			this.setState({
				scrollOffset: [xScrollOffset,yScrollOffset]
			});

			if (this.state.scrollOffset[1] > THRESHOLD) {
				this.switchStorie('down');
				this.setState({scrollOffset: [0,0]});
			} else if (this.state.scrollOffset[1] < -THRESHOLD) {
				this.switchStorie('up');
				this.setState({scrollOffset: [0,0]});

			} else if (this.state.scrollOffset[0] > THRESHOLD) {
				this.slide('next');
				this.setState({scrollOffset: [0,0]});
			} else if (this.state.scrollOffset[0] < -THRESHOLD) {
				this.slide('prev');
				this.setState({scrollOffset: [0,0]});
			}
		}
	},
	handleKey: function (e) {
		switch (e.keyCode) {
			case 39:
				this.slide('next');
				break;
			case 37:
				this.slide('prev');
				break;
			case 38:
				this.switchStorie('up');
				break;
			case 40:
				this.switchStorie('down');
				break;
		}
		
	},
	handleLink: function (e) {
		e.preventDefault();
		var href = e.target.getAttribute('href');
		this.slide(href);
	},

	slide: function (direction) {
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

			window.setTimeout(function(){
				this.state.scrollLock = false;
			}.bind(this),800);
		}
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
		var newStorie = this.state.currentStorie + 1;
		if (direction == 'up') newStorie = this.state.currentStorie - 1;
		

		if (newStorie >= 0 && newStorie <= this.state.stories.length-1) {
			this.setState({
				currentStorie: newStorie,
				recentStorie:  this.state.currentStorie,
				scrollLock:    true
			});

			window.setTimeout(function(){
				this.state.scrollLock = false;
			}.bind(this),800);
		}
	},
	getSwitchDirection: function () {
		var directions = {next: 'down', prev: 'up'};
		if (this.state.recentStorie > this.state.currentStorie) {
			//slide up
			directions = {next: 'up', prev: 'down'};
		}
		return directions;
	},
	
	render: function() {

		var ReactTransitionGroup = React.addons.TransitionGroup;

		var StorieElem = {};
		var storieData = this.state.stories[this.state.currentStorie];

		if (storieData) {
			StorieElem = (
				<Storie
					key                = {this.state.currentStorie}
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