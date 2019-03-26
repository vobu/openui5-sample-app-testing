describe('TodoApp', function() {
	it('should load test page', function () {
		expect(takeScreenshot()).toLookAs('initial');
	});
});
