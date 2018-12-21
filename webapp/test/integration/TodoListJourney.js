/* global QUnit */

sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/ui/test/Opa5",
	"sap/ui/demo/todo/test/MockServer",
	"sap/ui/demo/todo/test/integration/pages/App"
], function (opaTest, Opa5, MockServer) {
	"use strict";

	QUnit.module("Todo List", {
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

	opaTodo("representing something in development that is expected to fail for the time being", function (Given, When, Then) {
		Then.waitFor({
			success: function () {
				Opa5.assert.ok(false, "Quantum state!")
			}
		})
	});

	opaSkip("skipped integration test");


	opaTest("should add an item", function (Given, When, Then) {

		// Arrangements
		Given.iStartTheApp();

		//Actions
		When.onTheAppPage.iEnterTextForNewItemAndPressEnter("my test");

		// Assertions
		Then.onTheAppPage.iShouldSeeTheItemBeingAdded(3, "my test").
			and.iTeardownTheApp();
	});

	opaTest("should remove a completed item", function (Given, When, Then) {

		// Arrangements
		Given.iStartTheApp();

		//Actions
		When.onTheAppPage.iEnterTextForNewItemAndPressEnter("my test")
			.and.iSelectAllItems(true)
			.and.iClearTheCompletedItems()
			.and.iEnterTextForNewItemAndPressEnter("my test2");

		// Assertions
		Then.onTheAppPage.iShouldSeeAllButOneItemBeingRemoved("my test2").
			and.iTeardownTheApp();
	});

	opaTest("should select an item", function (Given, When, Then) {

		// Arrangements
		Given.iStartTheApp();

		//Actions
		When.onTheAppPage.iEnterTextForNewItemAndPressEnter("my test")
			.and.iSelectTheLastItem(true);

		// Assertions
		Then.onTheAppPage.iShouldSeeTheLastItemBeingCompleted(true).
			and.iTeardownTheApp();
	});

	opaTest("should unselect an item", function (Given, When, Then) {

		// Arrangements
		Given.iStartTheApp();

		//Actions
		When.onTheAppPage.iEnterTextForNewItemAndPressEnter("my test")
			.and.iSelectAllItems(true)
			.and.iClearTheCompletedItems()
			.and.iEnterTextForNewItemAndPressEnter("my test2")
			.and.iSelectTheLastItem(true)
			.and.iSelectTheLastItem(false);

		// Assertions
		Then.onTheAppPage.iShouldSeeTheLastItemBeingCompleted(false).
			and.iTeardownTheApp();
	});

	opaTest("should show correct count for completed items", function (Given, When, Then) {

		// Arrangements
		Given.iStartTheApp();

		//Actions
		When.onTheAppPage.iEnterTextForNewItemAndPressEnter("my test")
			.and.iSelectAllItems(true)
			.and.iClearTheCompletedItems()
			.and.iEnterTextForNewItemAndPressEnter("first")
			.and.iSelectTheLastItem(true)
			.and.iEnterTextForNewItemAndPressEnter("second")
			.and.iEnterTextForNewItemAndPressEnter("third")
			.and.iSelectTheLastItem(true);

		// Assertions
		Then.onTheAppPage.iShouldSeeItemLeftCount(1).
		and.iTeardownTheApp();
	});

	opaTest("again: should unselect an item", function (Given, When, Then) {

		// Arrangements
		Given.iStartTheApp();

		//Actions
		When.onTheAppPage.iEnterTextForNewItemAndPressEnter("my test")
			.and.iSelectAllItems(true)
			.and.iClearTheCompletedItems();

		// manually forced break point
		// When.waitFor({
		// 	success: function() {
		// 		debugger;
		// 	}
		// });

		When.onTheAppPage.iEnterTextForNewItemAndPressEnter("my test2")
			.and.iSelectTheLastItem(true)
			.and.iSelectTheLastItem(false);

		// Assertions
		Then.onTheAppPage.iShouldSeeTheLastItemBeingCompleted(false).
		and.iTeardownTheApp();
	});

});
