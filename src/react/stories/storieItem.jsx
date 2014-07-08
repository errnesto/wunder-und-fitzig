var StorieItem = React.createClass({
	mixins: [helpers],
	//animations
	componentWillEnter: function (callback) {
		//first position left or right from screen
		var nextClass = this.props.getSlideDirection().next;
		this.switchClass('active',nextClass);

		//then after 0 seconds move to center (timeoutnecessary)
		window.setTimeout(function () {
			this.switchClass(nextClass,'active');
			callback();
		}.bind(this),0);
	},

	componentWillLeave: function (callback) {
		//in timeout to keep animations in sync
		window.setTimeout(function () {
			var prevClass = this.props.getSlideDirection().prev;
			this.switchClass('active',prevClass);
		}.bind(this),0);

		this.prefixedEvent(this.getDOMNode(),'transitionEnd',callback);
	},


	render: function() {
		var style = {'background-image': 'url(assets/img/stories/'+this.props.background+')'}, 
		CoverImg;

		if (this.props.isCover) {
			style    = {'background': this.props.background};
			CoverImg = (
				<img 
					className = "cover-image" 
					src       = {'assets/img/stories/'+this.props.cover} />
			);
		}

		return (
			<div 
				className = {'storie-item active'} 
				style     = {style}>
				{CoverImg}
			</div>
		);
	}
});

