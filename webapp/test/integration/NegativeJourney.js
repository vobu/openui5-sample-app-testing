sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/demo/todo/test/integration/pages/App"
], function (Opa5, opaTest) {
	var sViewName = "sap.ui.demo.todo.view.App";

	QUnit.module("Negative Tests");
	opaTest("starting the app", function (Given, When, Then) {
		Given.iStartTheApp();
		Then.waitFor({
			success: function () {
				Opa5.assert.ok(true);
			}
		})
	});

	opaTest("find an invisible element", function (Given, When, Then) {
		Then.waitFor({
			id: "InvisibleText",
			viewName: sViewName,
			visible: false,
			success: function () {
				Opa5.assert.ok(true, "found the invisible element")
			},
			errorMessage: "invisible element not found"
		})
	});

	opaTest("make sure control doesn't exist", function (Given, When, Then) {
		Then.onTheAppPage.iMakeSureThereIsNo("module", "sap.m.Bla")
			.and.iMakeSureThereIsNo("id", "whatEver");
	});

	// ex: explicit shutdown
	opaTest("shutdown", function (Given, When, Then) {
		Then.iTeardownMyApp()
			.then(function () {
				Opa5.assert.ok(true, "shutting down...");
			})
	})
});
