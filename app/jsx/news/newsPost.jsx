/**
 * @jsx React.DOM
 */
 'use strict';

var React   = require('react');
var request = require('superagent');

var NewsPost = React.createClass({
	getInitialState: function() {
		return {
			picture: this.props.picture,
		};
	},
	//format facebook date String to a nice german date
	formatDate: function (createdTime) {
		var date = createdTime.split('T');
		date     = date[0].split('-');

		var day = date[2],
		month   = date[1] - 1,
		year    = date[0],

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
	componentDidMount: function (argument) {
		//replace low res images with large ones
		if (this.props.type == 'photo') {
			//get photos from facebook by object id
			request
				.get('https://graph.facebook.com/' + this.props.id)
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
			<div className={'fb-post ' + this.props.type}>
				{/*first element does not show the date*/}
				{ this.props.isFirst ? '' : <p className="fb-date">{this.formatDate(this.props.createdTime)}</p>}
				<a href={this.props.link} target="_blank" className="fb-link">
					<img className="fb-picture" src={this.state.picture} />
				</a>
				<p className="fb-message" dangerouslySetInnerHTML={{__html: this.formatAsHtml(this.props.message)}}></p>
			</div>
		);
	}
});

module.exports = NewsPost;