/** @jsx React.DOM */

(function () {
	"use-strict";
	var request = window.superagent;

	//= require mixins.jsx
	//= require_tree /news
	//= require_tree /stories

	//add react components to DOM
	window.onload = function () {
		var newsFeedFrame = document.getElementById('news-frame');
		var storiesFrame = document.getElementById('stories-frame');
		if ( newsFeedFrame ) {
			React.renderComponent(<NewsFeed 
				url="https://graph.facebook.com/wunderundfitzig/feed" 
				fields="message,object_id,created_time,picture,link,type"
				accessToken="1406084659649648|WQ4B1azOuVfGMUoUvDrtXsJ27DE" 
				limit="10" />, 
			newsFeedFrame);
		}
		if ( storiesFrame ) {
			React.renderComponent(<StoriesContainer 
				url="./stories.json" 
				limit="10" />, 
			storiesFrame);
		}
	};
})();