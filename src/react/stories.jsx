var StoriesContainer = React.createClass({
	getInitialState: function() {
		return {
			stories: [],
			currentStorie: 0,
			currentItems: []
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
	},
	slide: function (e) {
		var tempCurrentItems = this.state.currentItems,
			numberOfItems = this.state.stories[this.state.currentStorie].items.length,
			currentItem = tempCurrentItems[this.state.currentStorie] || 0;

		if (e.target.text == 'next') {
			currentItem ++;
		} else {
			currentItem --;
		}
		if (currentItem > numberOfItems -1) currentItem = 0;

		if (currentItem >= 0) {
			tempCurrentItems[this.state.currentStorie] = currentItem;
			this.setState({
				currentItems: tempCurrentItems
			});
		}
	},
	render: function() {
		var Stories = this.state.stories.map(function (storie, i) {
			return (
				<Storie 
				coverBackground={storie.cover_background} 
				coverImage={storie.cover} 
				coverText={storie.cover_text} 
				items={storie.items}
				currentItem={this.state.currentItems[i] || 0}
				slide={this.slide}>
					{storie.customer}
				</Storie>
			);
		},this);
		return (
			<section className="stories-container">
				{Stories}
			</section>
		);
	}
});

var Storie = React.createClass({
	render: function() {
		var prevNum = this.props.currentItem -1,
			activeNum = this.props.currentItem,
			nextNum = this.props.currentItem +1,
			next = 'next';

		if (prevNum < 0) prevNum = this.props.items.length -1;
		if (nextNum > this.props.items.length -1) {
			nextNum = 0;
			next = 'wraparound';
		}

		var prevItem = this.props.items[prevNum],
			activeItem = this.props.items[activeNum],
			nextItem = this.props.items[nextNum];

		return (
			<div className="storie" >
				<StorieItem 
					key={'item-'+prevNum} 
					pos="prev" 
					isCover={prevItem.is_cover} 
					image={prevItem.image} 
					text={prevItem.text} 
					background={prevItem.background}/>
				<StorieItem 
					key={'item-'+activeNum} 
					pos="active" 
					isCover={activeItem.is_cover} 
					image={activeItem.image} 
					text={activeItem.text} 
					background={activeItem.background}/>
				<StorieItem 
					key={'item-'+nextNum} 
					pos={next} 
					isCover={nextItem.is_cover} 
					image={nextItem.image} 
					text={nextItem.text} 
					background={nextItem.background}/>
					
				<h2 className="storie-title">
					{this.props.children} {this.props.currentItem}
				</h2>
				<a className="prev arrow" onClick={this.props.slide}>prev</a>
				<a className="next arrow" onClick={this.props.slide}>next</a>
			</div>
		);
	}
});

var StorieItem = React.createClass({
	render: function() {
		if (this.props.isCover){
			return this.transferPropsTo(<StorieCover></StorieCover>);
		} else {
			return this.transferPropsTo(<StoriePage></StoriePage>);
		}
	}
});

var StorieCover = React.createClass({
	render: function() {
		return (
			<div className={'cover storie-item ' + this.props.pos} style={{'background': this.props.background}}>
				<img src={this.props.image} />
				<p className="storie-text">
					{this.props.text}
				</p>
			</div>
		);
	}
});

var StoriePage = React.createClass({
	render: function() {
		return (
			<div className={'storie-item ' + this.props.pos} style={{'background-image': this.props.image}}>
				<p className="storie-text">
					{this.props.text}
				</p>
			</div>
		);
	}
});