var NewsPost = React.createClass({
	//format facebook date String to a nice german date
	formatDate: function (createdTime) {
		var date = new Date(createdTime),
			day = date.getDate(),
			month = date.getMonth(),
			year = date.getFullYear(),

			months = [ "Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
			if(day < 10){ day = '0'+day;}

		return day+'. '+months[month]+' '+year;
	},
	//format linebreaks and links as html
	formatAsHtml: function (message) {
		if (message) {
			var str = message.replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g, '<a href="$1" target="_blank">$1</a>');
			return str.replace(/(\r\n)|(\n\r)|\r|\n/g,"<br>");
		}
	},
	render: function() {
		return (
			<div className={'fb-post ' + this.props.type}>
				{/*first element does not show the date*/}
				{ this.props.isFirst ? '' : <p className="fb-date">{this.formatDate(this.props.createdTime)}</p>}
				<a href={this.props.link} target="_blank" className="fb-link">
					<img className="fb-picture" src={this.props.picture} />
				</a>
				<p className="fb-message" dangerouslySetInnerHTML={{__html: this.formatAsHtml(this.props.message)}}></p>
			</div>
		);
	}
});

var NewsFeed = React.createClass({
	getInitialState: function() {
		return {
			posts: [],
			loadingState: 'loading'
		};
	},
	componentDidMount: function() {
		//get news feed from facebook
		request
			.get(this.props.url)
			.query({ 
				fields: this.props.fields, 
				access_token: this.props.accessToken, 
				limit: this.props.limit 
			})
			.end(function(res){
				this.setState({
					posts: res.body.data,
					loadingState: res.status
				});
				
				this.loadHighresImgs();

			}.bind(this));
	},
	//replace low res images with large ones
	loadHighresImgs: function () {
		this.state.posts.forEach(function (post) {
			if (post.type == 'photo') {
				//get photos from facebook by object id
				request
					.get('https://graph.facebook.com/' + post.object_id)
					.query({ 
						fields: 'images', 
						access_token: this.props.accessToken, 
					})
					.end(function(res){
						//first picture should be the largest
						post.picture = res.body.images[0].source;
						this.forceUpdate(); //!need to force update because we changed state directly
					}.bind(this));
			}
		},this);
	},
	render: function() {
		var NewsPosts = this.state.posts.map(function (post,index) {
			if (post.type == 'photo' || post.type == 'link') {
				return (
					<NewsPost 
					isFirst={index === 0}
					createdTime={post.created_time} 
					link={post.link} 
					type={post.type}
					picture={post.picture} 
					message={post.message} />
				);
			}
		});
		return (
			<span>
				<h2 className={this.state.loadingState}>News</h2>
				{NewsPosts}
			</span>
		);
	}
});