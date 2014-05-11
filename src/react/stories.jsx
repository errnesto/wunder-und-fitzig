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
		var StorieItems = [];
		var positions = ['prev','active','next'];

		//create 3 StorieItems so we alwas have a current a previos and a next one
		for (var i = -1; i <= 1; i++) {
			var itemNum = this.props.currentItem + i,
				pos = positions[i+1]; //we count from -1 array starts at 0

			//hande boundarys
			if (itemNum < 0) itemNum = this.props.items.length -1;
			if (itemNum > this.props.items.length -1) {
				itemNum = 0;
				pos = 'wraparound';
			}

			var item = this.props.items[itemNum];

			StorieItems.push(
				<StorieItem 
					key={'item-'+itemNum} 
					pos={pos} 
					isCover={item.is_cover} 
					background={item.background} 
					cover={item.cover}/>
			);
		}

		var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

		return (
			<div className="storie" >
				{StorieItems}
				<div className="inner-storie">
					<h2 className="storie-title">{this.props.children}</h2>
					<ReactCSSTransitionGroup transitionName="flip">
						<div className="storie-text-wrapper" key={'text'+this.props.currentItem} >
							<p className="storie-text" dangerouslySetInnerHTML={{__html: this.props.items[this.props.currentItem].text}} />
						</div>
					</ReactCSSTransitionGroup>
					{this.props.currentItem === 0 ? '' : <a className="prev arrow" onClick={this.props.slide}>prev</a>}
					<a className="next arrow" onClick={this.props.slide}>next</a>
				</div>
			</div>
		);
	}
});

var StorieItem = React.createClass({
	render: function() {
		var style = {'background-image': 'url(assets/img/stories/'+this.props.background+')'}, 
			CoverImg;
		if (this.props.isCover) {
			style = {'background': this.props.background};
			CoverImg = <img className="cover-image" src={'assets/img/stories/'+this.props.cover} />;
		}
		return (
			<div className={'cover storie-item ' + this.props.pos} style={style}>
				{CoverImg}
			</div>
		);
	}
});
