describe('TodoAppVisual', function() {
	it('should compare the start page to the reference image', function () {
		expect(takeScreenshot()).toLookAs('appStarted');
	});
});
