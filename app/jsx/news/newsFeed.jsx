/**
 * @jsx React.DOM
 */
 'use strict';

var React    = require('react');

var NewsPost = require('./newsPost.jsx');
var request  = require('superagent');

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
				fields:       this.props.fields, 
				access_token: this.props.accessToken, 
				limit:        this.props.limit 
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
					<NewsPost
						key         = {'key-'+index} 
						id          = {post.object_id}
						isFirst     = {index === 0}
						createdTime = {post.created_time} 
						link        = {post.link} 
						type        = {post.type}
						picture     = {post.picture} 
						message     = {post.message} 
					/>
				);
			}
		});

		return (
			<span>
				<h2 className = {this.state.loadingState}>News</h2>
				{NewsPosts}
			</span>
		);
	}
});

module.exports = NewsFeed;