var metalsmith	= require('metalsmith'),
	layouts		= require('metalsmith-layouts'),
	markdown	= require('metalsmith-markdown'),
	navigation 	= require('metalsmith-navigation'),
	permalinks	= require('metalsmith-permalinks');

// Navigation plugin configuration
var navConfigs = {
		primary: {
			sortBy: 'navOrder',
			includeDirs: true,
			filterProperty: 'navGroups'
		}
	},
	navSettings = {
		navListProperty: 'navs',
		permalinks: true
	};


var siteBuild = metalsmith(__dirname)
	// **** Pipeline Configuration ****
	.source('./src')
	.destination('./build-perma')

	// **** Pipeline ****
	// process markdown   
	.use(markdown())
	// enable permalinks
	.use(permalinks({
		relative: false
	}))
	// process navigation tree
	.use(navigation(navConfigs, navSettings))
	// process templates
	.use(layouts({
		engine: "handlebars",
		partials: {
			testNav: 'partials/testNav',
			testNavItem : 'partials/testNavItem'
		}
	}))

	// **** Build ****
	.build(function (err) {
		if (err) {
			console.log(err);
		}
		else {
			console.log('Site build complete!');
		}
	});