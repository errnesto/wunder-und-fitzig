var StoriesContainer = React.createClass({
	getInitialState: function() {
		return {
			stories: [],
			currentStorie: 0,
			currentItems: [],
			recentItems: []
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
	
	render: function() {
		var Stories = this.state.stories.map(function (storie, i) {
			return (
				<Storie 
					key={i}
					items={storie.items}
					currentItem={this.state.currentItems[i] || 0}
					slide={this.slide}
					getSlideDirection={this.getSlideDirection}
					customer={storie.customer}
				/>
			);
		},this);

		return (
			<section className="stories-container">
				{Stories}
			</section>
		);
	}
});