var StoriesContainer = React.createClass({
	getInitialState: function() {
		return {
			stories: [],
			currentStorie: 0,
			currentItems: [],
			recentItems: [],

			scrollOffset: 0,
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

		window.addEventListener('keydown', this.slide);
	},

	slide: function (e) {
		var tempCurrentItems = this.state.currentItems,
		tempRecentItems      = this.state.recentItems,
		numberOfItems        = this.state.stories[this.state.currentStorie].items.length,
		currentItem          = tempCurrentItems[this.state.currentStorie] || 0,
		recentItem           = currentItem;

		if (e.keyCode == 39 || e.target.text == 'next') {
			//next link or right arrow key
			currentItem ++;
		} else if (e.keyCode == 37 || e.target.text == 'prev') {
			//prev link or left arrow key
			currentItem --;
		}

		if (currentItem > numberOfItems -1) currentItem = 0;
		if (currentItem >= 0) {
			tempCurrentItems[this.state.currentStorie] = currentItem;
			tempRecentItems[this.state.currentStorie] = recentItem;

			this.setState({
				currentItems: tempCurrentItems,
				recentItems: tempRecentItems
			});
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

	handleWheel: function (e) {
		e.preventDefault();

		if (!this.state.scrollLock) {
			// writing to state directly but we dont need component to update anything
			this.state.scrollOffset += e.deltaY;
			console.log(this.state.scrollOffset);

			if (Math.abs(this.state.scrollOffset) > 50) {
				var newStorie = this.state.currentStorie + 1;
				if (this.state.scrollOffset < 0) newStorie = this.state.currentStorie - 1;

				if (newStorie >= 0 && newStorie <= this.state.stories.length-1) {
					this.setState({
						currentStorie: newStorie,
						scrollOffset: 0,
						scrollLock: true
					});
					window.setTimeout(function(){this.state.scrollLock = false;}.bind(this),800);
				}
			}
		}

	},
	
	render: function() {

		var StorieElem;
		var storieData = this.state.stories[this.state.currentStorie];
		if (storieData) {
			StorieElem = <Storie 
				items={storieData.items}
				customer={storieData.customer}
				currentItem={this.state.currentItems[this.state.currentStorie] || 0}
				slide={this.slide}
				getSlideDirection={this.getSlideDirection}
			/>;
		}

		return (
			<section className="stories-container" onWheel={this.handleWheel}>
				{StorieElem}
			</section>
		);
	}
});