var StoriesContainer = React.createClass({
	getInitialState: function() {
		return {
			stories: [],
		};
	},
	componentDidMount: function() {
		//get news feed from facebook
		request
			.get(this.props.url)

			.end(function(res){
				this.setState({
					stories: res.body,
				});
			}.bind(this));
	},
	render: function() {
		var Stories = this.state.stories.map(function (storie, index) {
			return <Storie 
				coverBackground={storie.cover_background} 
				coverImage={storie.cover} 
				coverText={storie.cover_text} 
				items={storie.stories}>
					{storie.customer}
				</Storie>;
		});
		return (
			<section className="stories-container">
				{Stories}
			</section>
		);
	}
});

var Storie = React.createClass({
	render: function() {
		var StorieItems = this.props.items.map(function (item) {
			return (
					<div className="storie-item" style={{'background-image': item.image}}>
						<p className="storie-text">
							{item.text}
						</p>
					</div>
				);
		});
		return (
			<div className="storie" >
				<h2 className="storie-title">
					{this.props.children}
				</h2>
				<div className="storie-items-wrapper">
					<div className="cover storie-item" style={{'background': this.props.coverBackground}}>
						<img src={this.props.coverImage} />
					</div>
					{StorieItems}
				</div>
				
			</div>
		);
	}
});