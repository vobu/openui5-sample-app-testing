sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/ui/core/mvc/Controller",
	"sap/ui/demo/todo/controller/App.controller",
	"sap/ui/core/mvc/XMLView",
	"sap/ui/model/json/JSONModel",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (ManagedObject, Controller, AppController, XMLView, JSONModel/*, sinon, sinonQunit*/) {
	"use strict";

	QUnit.module("advanced UI5 unit test cases", {});

	QUnit.test("test a custom control (working in a 'real' XML view) in a Unit Test", function (assert) {
		var fnDone = assert.async();
		XMLView.create({
			viewName: "sap/ui/demo/todo/test/unit/view/AppWithInputCC"
		})
			.then(function (oView) {
				return oView.placeAt("qunit-fixture");
			})
			.then(function (oView) {
				var oController = oView.getController();
				var oInput = oController.byId("theCustomControlInput");
				return assert.strictEqual(oInput.getPlaceholder(), "🤔", "Placeholder checked out fine");
			})
			.then(fnDone)
			.catch(function (oError) {
				// do sth clever here
				fnDone();
			})

	});

});
