exports.config = {
	// profile: 'visual',
	profile: 'integration',
	baseUrl: 'http://localhost:8080/index.html',

	// browsers:[{
		// browserName: (_chrome_|chromeMobileEmulation|chromeHeadless|firefox|ie|safari|edge),
		// browserVersion: '*',
		// platformName: (_windows_|mac|linux|android|ios|winphone),
		// platformVersion: '*',
		// platformResolution: 'WIDTHxHEIGHT',
		// ui5.theme: (bluecrystal|_belize_|hcp),
		// ui5.direction: (rtl|_ltr_),
		// ui5.mode: (_cozy_|compact)
	// }],

	take: true,
	compare: true,
	update: true,

	storageProvider: {
		name: './image/localStorageProvider',
		refImagesRoot: './target',
		actImagesRoot: './target'
	},
	screenshotProvider: {
		name: './image/localScreenshotProvider',
		screenshotSleep: 100
	},
	comparisonProvider: {
		name: './image/localComparisonProvider'
	}
};
