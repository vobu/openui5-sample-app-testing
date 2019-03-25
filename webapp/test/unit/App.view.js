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

	QUnit.test("access a view model via the XML view", function (assert) {
		var fnDone = assert.async();
		var oController = new AppController();
		XMLView.create({
			viewName: "sap/ui/demo/todo/test/unit/view/App"
		})
			.then(function (oView) {
				oView.placeAt("tmp");
			})
			.then(fnDone)
			.catch(function (oError) {
				"";
				fnDone();
			})

	});

});
