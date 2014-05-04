/** @jsx React.DOM */

(function () {
	"use-strict";
	var request = window.superagent;

var NewsPost = React.createClass({displayName: 'NewsPost',
	getInitialState: function() {
		return {
			picture: this.props.picture,
		};
	},
	//format facebook date String to a nice german date
	formatDate: function (createdTime) {
		var date = createdTime.split('T');
			date = date = date[0].split('-');

		var day = date[2],
			month = date[1] - 1,
			year = date[0],

			months = [ "Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

		return day+'. '+months[month]+' '+year;
	},
	//format linebreaks and links as html
	formatAsHtml: function (message) {
		if (message) {
			var str = message.replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g, '<a href="$1" target="_blank">$1</a>');
			return str.replace(/(\r\n)|(\n\r)|\r|\n/g,"<br>");
		}
	},
	componentWillMount: function (argument) {
		//replace low res images with large ones
		if (this.props.type == 'photo') {
			//get photos from facebook by object id
			request
				.get('https://graph.facebook.com/' + this.props.key)
				.query({ 
					fields: 'images', 
					access_token: this.props.accessToken, 
				})
				.end(function(res){
					this.setState({
						//images[0] should be the largest
						picture: res.body.images[0].source
					});
				}.bind(this));
		}
	},
	render: function() {
		return (
			React.DOM.div( {className:'fb-post ' + this.props.type}, 
				/*first element does not show the date*/
				 this.props.isFirst ? '' : React.DOM.p( {className:"fb-date"}, this.formatDate(this.props.createdTime)),
				React.DOM.a( {href:this.props.link, target:"_blank", className:"fb-link"}, 
					React.DOM.img( {className:"fb-picture", src:this.state.picture} )
				),
				React.DOM.p( {className:"fb-message", dangerouslySetInnerHTML:{__html: this.formatAsHtml(this.props.message)}})
			)
		);
	}
});

var NewsFeed = React.createClass({displayName: 'NewsFeed',
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
					loadingState: 'load-'+res.status
				});
			}.bind(this));
	},
	render: function() {
		var NewsPosts = this.state.posts.map(function (post,index) {
			if (post.type == 'photo' || post.type == 'link') {
				return (
					NewsPost( 
					{key:post.object_id,
					isFirst:index === 0,
					createdTime:post.created_time, 
					link:post.link, 
					type:post.type,
					picture:post.picture, 
					message:post.message} )
				);
			}
		});
		return (
			React.DOM.span(null, 
				React.DOM.h2( {className:this.state.loadingState}, "News"),
				NewsPosts
			)
		);
	}
});

var StoriesContainer = React.createClass({displayName: 'StoriesContainer',
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
			return Storie( 
				{coverBackground:storie.cover_background, 
				coverImage:storie.cover, 
				coverText:storie.cover_text, 
				items:storie.stories}, 
					storie.customer
				);
		});
		return (
			React.DOM.section( {className:"stories-container"}, 
				Stories
			)
		);
	}
});

var Storie = React.createClass({displayName: 'Storie',
	render: function() {
		var StorieItems = this.props.items.map(function (item) {
			return (
					React.DOM.div( {className:"storie-item", style:{'background-image': item.image}}, 
						React.DOM.p( {className:"storie-text"}, 
							item.text
						)
					)
				);
		});
		return (
			React.DOM.div( {className:"storie"} , 
				React.DOM.h2( {className:"storie-title"}, 
					this.props.children
				),
				React.DOM.div( {className:"storie-items-wrapper"}, 
					React.DOM.div( {className:"cover storie-item", style:{'background': this.props.coverBackground}}, 
						React.DOM.img( {src:this.props.coverImage} )
					),
					StorieItems
				)
				
			)
		);
	}
});


	//add react components to DOM
	window.onload = function () {
		var newsFeedFrame = document.getElementById('news-frame');
		var storiesFrame = document.getElementById('stories-frame');
		if ( newsFeedFrame ) {
			React.renderComponent(NewsFeed( 
				{url:"https://graph.facebook.com/wunderundfitzig/feed", 
				fields:"message,object_id,created_time,picture,link,type",
				accessToken:"1406084659649648|WQ4B1azOuVfGMUoUvDrtXsJ27DE", 
				limit:"10"} ), 
			newsFeedFrame);
		}
		if ( storiesFrame ) {
			React.renderComponent(StoriesContainer( 
				{url:"./stories.json", 
				limit:"10"} ), 
			storiesFrame);
		}
	};
})();