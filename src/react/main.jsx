/** @jsx React.DOM */

(function () {
	var request = window.superagent;

	//= include news.jsx

	//add react components to DOM
	window.onload = function () {
		var newsFeedFrame = document.getElementById('news-frame');
		if ( newsFeedFrame ) {
			React.renderComponent(<NewsFeed 
				url="https://graph.facebook.com/wunderundfitzig/feed" 
				fields="message,object_id,created_time,picture,link,type"
				accessToken="1406084659649648|WQ4B1azOuVfGMUoUvDrtXsJ27DE" 
				limit="10" />, 
			newsFeedFrame);
		}
	};
})();