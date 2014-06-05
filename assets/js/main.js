/** @jsx React.DOM */

(function () {
	"use-strict";
	var request = window.superagent;

var helpers = {
  switchClass: function (from, to) {
  	var domNode = this.getDOMNode();
  	domNode.className = domNode.className.replace(from,to);
  },
  prefixedEvent: function (element, type, callback) {
  	pfx = ["webkit", "moz", "MS", "o", ""];

  	for (var p = 0; p < pfx.length; p++) {
  		if (!pfx[p]) type = type.toLowerCase();
  		element.addEventListener(pfx[p]+type, callback, false);
  	}
  }
};

	//= require_tree /news
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
						message:post.message} 
					)
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

	//= require_tree /stories
var Storie = React.createClass({displayName: 'Storie',
	render: function() {

		var currentItem = this.props.items[this.props.currentItem];

		var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
		var ReactTransitionGroup = React.addons.TransitionGroup;

		return (
			React.DOM.div( {className:"storie"}, 
				ReactTransitionGroup(null, 
					StorieItem( 
						{key:this.props.currentItem, 
						getSlideDirection:this.props.getSlideDirection,
						isCover:currentItem.is_cover, 
						background:currentItem.background, 
						cover:currentItem.cover}
					)
				),

				React.DOM.div( {className:"inner-storie"}, 
					React.DOM.h2( {className:"storie-title"}, 
						this.props.customer
					),

					ReactCSSTransitionGroup( {transitionName:"flip"}, 
						React.DOM.div( {className:"storie-text-wrapper", key:'text'+this.props.currentItem} , 
							React.DOM.p( 
								{className:"storie-text", 
								dangerouslySetInnerHTML:{__html: this.props.items[this.props.currentItem].text}} 
							)
						)
					),
					
					this.props.currentItem === 0 ? '' : React.DOM.a( {className:"prev arrow", onClick:this.props.slide}, "prev"),
					React.DOM.a( {className:"next arrow", onClick:this.props.slide}, "next")
				)
			)
		);
	}
});
var StorieItem = React.createClass({displayName: 'StorieItem',
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
			style = {'background': this.props.background};
			CoverImg = React.DOM.img( {className:"cover-image", src:'assets/img/stories/'+this.props.cover} );
		}

		return (
			React.DOM.div( {className:'storie-item active', style:style}, 
				CoverImg
			)
		);
	}
});


var StoriesContainer = React.createClass({displayName: 'StoriesContainer',
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
			StorieElem = Storie( 
				{items:storieData.items,
				customer:storieData.customer,
				currentItem:this.state.currentItems[this.state.currentStorie] || 0,
				slide:this.slide,
				getSlideDirection:this.getSlideDirection}
			);
		}

		return (
			React.DOM.section( {className:"stories-container", onWheel:this.handleWheel}, 
				StorieElem
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