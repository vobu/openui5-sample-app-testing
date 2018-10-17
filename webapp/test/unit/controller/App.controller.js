sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/ui/core/mvc/Controller",
	"sap/ui/demo/todo/controller/App.controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (ManagedObject, Controller, AppController, JSONModel/*, sinon, sinonQunit*/) {
	"use strict";

	QUnit.module("common UI5 unit test cases", {
		//// not yet introduced in the blog series :)
		// before: function() {
		// 	this.oAppController = new AppController();
		// 	this.oViewStub = new ManagedObject({});
		// 	sinon.stub(Controller.prototype, "getView").returns(this.oViewStub);
		//
		// 	this.oJSONModelStub = new JSONModel({
		// 		todos: []
		// 	});
		// 	this.oViewStub.setModel(this.oJSONModelStub);
		// },
		//
		// after: function() {
		// 	// never forget to un-stub
		// 	Controller.prototype.getView.restore();
		//
		// 	this.oViewStub.destroy();
		//
		// }
	});

	QUnit.test("standalone controller method w/o dependencies", function (assert) {
		// arrangement
		var oController = new AppController();

		// action
		oController.onInit();

		// assertions
		assert.ok(oController.aSearchFilters);
		assert.ok(oController.aTabFilters);
	});

	QUnit.test("controller method with runtime dependencies (here: getView, getDomRef)", function (assert) {
		//// begin arrangements
		// regular init of controller
		var oController = new AppController();
		// regular init of a JSON model
		var oJsonModelStub = new JSONModel({});
		var oNewToDoModelStub = new JSONModel({});
		// construct a dummy DOM element
		var oDomElementStub = document.createElement("div");
		// construct a dummy View
		var oViewStub = new ManagedObject({});

		// mock View.byId().getDomRef()
		oViewStub.byId = function (sNeverUsed) {
			return {
				getDomRef: function () {
					return oDomElementStub;
				}
			}
		};

		// regular setting of a model to a View
		oViewStub.setModel(oJsonModelStub);
		oViewStub.setModel(oNewToDoModelStub, "new");

		// stubbing Controller.getView() to return our dummy view object
		var oGetViewStub = sinon.stub(Controller.prototype, "getView").returns(oViewStub);
		//// end arrangements

		// prepare data model for controller method
		oNewToDoModelStub.setProperty("/newTodo", "some new item");

		// actual test call!
		oController.addTodo();

		// check result of test call
		assert.strictEqual(oJsonModelStub.getProperty("/todos").length, 1, "1 new todo item was added");

		// follow-up: never forget to un-stub!
		oGetViewStub.restore();
	});

	QUnit.test("async function in controller", function (assert) {
		// tell QUnit to wait for it
		var fnDone = assert.async();

		// arrangements
		// regular init of controller
		var oController = new AppController();
		// regular init of a JSON model
		var oJsonModelStub = new JSONModel({
			"todos": []
		});
		// construct a dummy View
		var oViewStub = new ManagedObject({});
		// regular setting of a model to a View
		oViewStub.setModel(oJsonModelStub);
		// stubbing Controller.getView() to return our dummy view object
		var oGetViewStub = sinon.stub(Controller.prototype, "getView").returns(oViewStub);

		// action + assertion: start the Promise chain!
		oController.getTodosViaPromise()
			.then(function (aTodos) {
				assert.ok(aTodos.length >= 0, "todos exist (zero or more)");
			})
			.then(oGetViewStub.restore) // follow-up: never forget to un-stub!
			.then(fnDone) // tell QUnit test is finished
			// never forget to catch potential errors in the promise chain
			// and do proper clean up
			.catch(function (oError) {
				assert.ok(false, "Error occured: " + oError);
				// follow-up: never forget to un-stub!
				oGetViewStub.restore();
				// tell QUnit test is finished
				fnDone();
			});
	});

	//// Original Unit Tests
	// QUnit.test("Should add a todo element to the model", function (assert) {
	// 	// Arrange
	// 	// initial assumption: to-do list is empty
	// 	assert.strictEqual(this.oJSONModelStub.getObject('/todos').length, 0, "There must be no todos defined.");
    //
	// 	// Act
	// 	this.oJSONModelStub.setProperty('/newTodo', "new todo item");
	// 	this.oAppController.addTodo();
    //
	// 	// Assumption
	// 	assert.strictEqual(this.oJSONModelStub.getObject('/todos').length, 1, "There is one new item.");
	// });
    //
	// QUnit.test("Should toggle the completed items in the model", function (assert) {
	// 	// Arrange
	// 	var oModelData = {
	// 		todos: [{
	// 			"title": "Start this app",
	// 			"completed": false
	// 		}],
	// 		itemsLeftCount: 1
	// 	};
	// 	this.oJSONModelStub.setData(oModelData);
    //
    //
	// 	// initial assumption
	// 	assert.strictEqual(this.oJSONModelStub.getObject('/todos').length, 1, "There is one item.");
	// 	assert.strictEqual(this.oJSONModelStub.getProperty('/itemsLeftCount'), 1, "There is one item left.");
    //
	// 	// Act
	// 	this.oJSONModelStub.setProperty("/todos/0/completed", true);
	// 	this.oAppController.updateItemsLeftCount();
    //
	// 	// Assumption
	// 	assert.strictEqual(this.oJSONModelStub.getProperty('/itemsLeftCount'), 0, "There is no item left.");
	// });
    //
	// QUnit.test("Should clear the completed items", function (assert) {
	// 	// Arrange
	// 	var oModelData = {
	// 		todos: [{
	// 			"title": "Start this app1",
	// 			"completed": false
	// 		}, {
	// 			"title": "Start this app2",
	// 			"completed": true
	// 		}],
	// 		itemsLeftCount: 1
	// 	};
	// 	this.oJSONModelStub.setData(oModelData);
    //
    //
	// 	// initial assumption
	// 	assert.strictEqual(this.oJSONModelStub.getObject('/todos').length, 2, "There are two items.");
	// 	assert.strictEqual(this.oJSONModelStub.getProperty('/itemsLeftCount'), 1, "There is no item left.");
    //
	// 	// Act
	// 	this.oAppController.clearCompleted();
	// 	this.oAppController.updateItemsLeftCount();
    //
	// 	// Assumption
	// 	assert.strictEqual(this.oJSONModelStub.getObject('/todos').length, 1, "There is one item left.");
	// 	assert.strictEqual(this.oJSONModelStub.getProperty('/itemsLeftCount'), 1, "There is one item left.");
	// });
    //
	// QUnit.test("Should update items left count when no todos are loaded, yet", function (assert) {
	// 	// Arrange
	// 	var oModelData = {};
	// 	this.oJSONModelStub.setData(oModelData);
    //
    //
	// 	// initial assumption
	// 	assert.strictEqual(this.oJSONModelStub.getObject('/todos'), undefined, "There are no items.");
	// 	assert.strictEqual(this.oJSONModelStub.getProperty('/itemsLeftCount'), undefined, "Items left is not set");
    //
	// 	// Act
	// 	this.oAppController.updateItemsLeftCount();
    //
	// 	// Assumption
	// 	assert.strictEqual(this.oJSONModelStub.getProperty('/itemsLeftCount'), 0, "There is no item left.");
	// });

});
