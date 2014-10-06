/**
 * @jsx React.DOM
 */
 'use strict';

var React    = require('react');
var NewsFeed = require('./newsFeed.jsx');

var NewsPage = React.createClass({

	render: function() {
		return (
			<section 
				className = "inner-content">
				<h1 
					className = "neugierig">
					neu<strong>gierig</strong>?
				</h1>
				<div 
					className = "contact">
					<div 
						className = "wrapper">
						<p>
							wunder &amp; fitzig<br/>
							Web &amp; Print
						</p>
						<p>
							<a 
								className = "externlink" 
								href      = "https://goo.gl/maps/VsHnP" 
								target    = "_blank">
								Lausitzer Straße 47 <br/>
								10999 Berlin
							</a>
						</p>
						<p>
							030 864 514 59 <br/>
							<a 
								className = "email" 
								href      = "mailto:info@wunderundfitzig.de">
								info@wunderundfitzig.de
							</a>
						</p>
					</div>
				</div>
				<div 
					id        = "news-frame" 
					className = "news-feed">
				<NewsFeed 
					url         = "https://graph.facebook.com/wunderundfitzig/feed" 
					fields      = "message,object_id,created_time,picture,link,type"
					accessToken = "1406084659649648|WQ4B1azOuVfGMUoUvDrtXsJ27DE" 
					limit       = "10"
				/>
				</div>
				<p 
					className = "more-news-link">
					ältere News sind für alle Ewigkeit auf <a href="http://www.facebook.com/wunderundfitzig" target="_blank">facebook</a> zu finden
				</p>
				<div 
					className = "impressum">
					<p>
						wunder &amp; fitzig GBR - 2014
					</p>
				</div>
			</section>
		);
	}
});

module.exports = NewsPage;