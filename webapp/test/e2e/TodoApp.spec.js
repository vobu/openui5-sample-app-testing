describe('TodoApp', function() {
	// it('should take the reference screenshot', function () {
	// 	expect(takeScreenshot());
	// });

	it('should load test page', function () {
		expect(takeScreenshot()).toLookAs('appStarted');
	});
});
