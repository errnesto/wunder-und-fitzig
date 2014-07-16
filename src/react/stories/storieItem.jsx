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
		console.log(this.props.invalid);
		var classNames = classSet({
			'storie-item'   : true,
			'active'        : true,
			'invalid-left'  : this.props.invalid == 'prev'
		});
		var style      = {
			'background-image': 'url(assets/img/stories/'+this.props.background+')'
		};
		var CoverImg;

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
				className = {classNames} 
				style     = {style}>
				{CoverImg}
			</div>
		);
	}
});

