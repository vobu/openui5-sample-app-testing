/* global QUnit */

sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/ui/demo/todo/test/MockServer",
	"sap/ui/demo/todo/test/integration/pages/App"
], function (opaTest, MockServer) {
	"use strict";

	QUnit.module("Filter", {
		beforeEach: function () {
			if (_global.mockserver) {
				this.oMockserver = MockServer.init(_global.mockserverParameters);
			}
		},
		afterEach: function () {
			if (this.oMockserver) {
				this.oMockserver.shutdown();
			}
		}
	});

	opaTest("should show correct items when filtering for 'Active' items", function (Given, When, Then) {

		// Arrangements
		Given.iStartTheApp();

		//Actions
		When.onTheAppPage.iFilterForItems("active");

		// Assertions
		Then.onTheAppPage.iShouldSeeItemCount(1).and.iTeardownTheApp();
	});

	opaTest("should show correct items when filtering for 'Completed' items", function (Given, When, Then) {

		// Arrangements
		Given.iStartTheApp();

		//Actions
		When.onTheAppPage.iFilterForItems("completed");

		// Assertions
		Then.onTheAppPage.iShouldSeeItemCount(1).and.iTeardownTheApp();
	});

	opaTest("should show correct items when filtering for 'Completed' items and switch back to 'All'", function (Given, When, Then) {

		// Arrangements
		Given.iStartTheApp();

		//Actions
		When.onTheAppPage.iFilterForItems("completed");

		// Assertions
		Then.onTheAppPage.iShouldSeeItemCount(1);

		//Actions
		When.onTheAppPage.iFilterForItems("all");

		// Assertions
		Then.onTheAppPage.iShouldSeeItemCount(2).and.iTeardownTheApp();
	});

});
