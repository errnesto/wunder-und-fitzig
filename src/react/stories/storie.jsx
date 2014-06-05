var Storie = React.createClass({
	render: function() {

		var currentItem = this.props.items[this.props.currentItem];

		var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
		var ReactTransitionGroup = React.addons.TransitionGroup;

		return (
			<div className="storie">
				<ReactTransitionGroup>
					<StorieItem 
						key={this.props.currentItem} 
						getSlideDirection={this.props.getSlideDirection}
						isCover={currentItem.is_cover} 
						background={currentItem.background} 
						cover={currentItem.cover}
					/>
				</ReactTransitionGroup>

				<div className="inner-storie">
					<h2 className="storie-title">
						{this.props.customer}
					</h2>

					<ReactCSSTransitionGroup transitionName="flip">
						<div className="storie-text-wrapper" key={'text'+this.props.currentItem} >
							<p 
								className="storie-text" 
								dangerouslySetInnerHTML={{__html: this.props.items[this.props.currentItem].text}} 
							/>
						</div>
					</ReactCSSTransitionGroup>
					
					{this.props.currentItem === 0 ? '' : <a className="prev arrow" onClick={this.props.slide}>prev</a>}
					<a className="next arrow" onClick={this.props.slide}>next</a>
				</div>
			</div>
		);
	}
});