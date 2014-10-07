/**
 * @jsx React.DOM
 */
 'use strict';

var React    = require('react');

var NewsPage = React.createClass({

	render: function() {
		return (
			<section
				className = "creatives-page">
				<div 
					className = "inner-content sticker" 
					id        = "hrWunder">
					<div 
						className = "right-person" 
						style     = {{backgroundImage: 'url(assets/img/people/hrWunder.jpg)'}} />
					<div 
						className = "text">
						<h2>
							Herr Wunder
						</h2>
						<span 
							className = "paragraphs">
							<p>
								Herr Wunder konzeptioniert und programmiert
								Webseiten.
							</p>
							<p>
								Konzepte und Design hat er gerne modern und radikal schlicht.
								Ziel ist es nur was wirklich gebraucht wird umsusetzen,
								und das mit größtmöglicher Perfektion.
							</p>
						</span>
					</div>
				</div>

				<div 
					className = "inner-content sticker" 
					id        = "frFitzig">
					<div 
						className = "left-person" 
						style     = {{backgroundImage: 'url(assets/img/people/frFitzig.jpg)', left: '-10%'}} />
					<div 
						className = "right-text">
						<h2>
							Frau Fitzig
						</h2>
						<span 
							className = "paragraphs">
							<p>
								Formen, Farbe, Strategien!
							</p>
							<p>
								Frau Fitzig spricht fliesend Gestaltung.<br/>
								Mit Begeisterung etwickelt sie Markenbilder,
								die nicht nur verdammt gut aussehen sondern klar
								durchdacht sind.
							</p>
						</span>
					</div>
				</div>

				<div 
					className = "inner-content sticker" 
					id        = "hrReich">
					<div 
						className = "right-person" 
						style     = {{backgroundImage: 'url(assets/img/people/hrReich.jpg)'}} />
					<div 
						className = "text">
						<h2>
							Herr Reich
						</h2>
						<span 
							className = "paragraphs">
							<p>
								Seit 2011 studiert Herr Reich internationale Medieninformatik in Berlin.
							<p>
							</p>
								Als Teil der Generation Praktikum arbeitete er in Freiburg bei der Werkstatt für kreative Konzepte.
							</p>
							<p>
								Bei der linkbird GmbH in Berlin war er Teil des SEO Teams. Und später entwickelte er viele viele kleine und große Seiten für Common People Interactice in Barcelona.
							</p>
						</span>
					</div>
				</div>

				<div 
					className = "inner-content sticker" 
					id        = "frSpringmann">
					<div 
						className = "left-person" 
						style     = {{backgroundImage: 'url(assets/img/people/frSpringmann.jpg)'}} />
					<div 
						className = "right-text">
						<h2>
							Frau Springmann
						</h2>
						<span 
							className = "paragraphs">
							<p>
								Frau Springmann entstammt nicht nur einer Künstlerfamilie, sie ist seit 2010 auch staatlich geprüfte Grafikdesignerin. 
							</p>
							<p>
								Design allein war ihr aber nicht genug darum studierte sie,
								nach einem Praktikum bei Schürmann PR, Wirtschfaskomikation in Berlin
							</p>
							<p>
								Praxiserfahrung sammelte sie dann bei MetaDesign auch in Berlin.
							</p>
						</span>
					</div>
				</div>

				<div 
					className = "inner-content sticker" 
					id        = "MartinaManuel">
					<div 
						className = "center-text">
						<h2>
							Martina &amp; Manuel
						</h2>
						<span 
							className = "paragraphs">
							<p>
								Wenn sie gerade mal nicht von einem Termin zum nächsten hetzt, sitzt Martina in der heimischen Küche und träumt von Luftschlössern oder Meister Proper.
							</p>
							<p>
								Manuel genießt sein Lotterleben in Berlin. Lange Reden über sinnvolle und sinnfreie Dinge gehören zu seinen absoluten Lieblingsbeschäftigungen.<br/> 
								Ab und zu kann man ihn in einem Hipster Cafe antreffen. Hier bestellt er seine Inspiration.
							</p>
							<p>
								Beide leben mehr oder weniger friedlich zusammen in Kreuzberg.
							</p>
						</span>
					</div>
					<div 
						className = "center-person" 
						style     = {{backgroundImage: 'url(assets/img/people/manuMartina.jpg)'}} />
				</div>

			</section>
		);
	}
});

module.exports = NewsPage;