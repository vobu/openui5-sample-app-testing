sap.ui.define([
	"sap/ui/core/Control",
	"sap/ui/base/ManagedObject",
	"sap/ui/core/mvc/Controller",
	"sap/ui/demo/todo/controller/App.controller",
	"sap/ui/core/mvc/XMLView",
	"sap/ui/model/json/JSONModel",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (Control, ManagedObject, Controller, AppController, XMLView, JSONModel/*, sinon, sinonQunit*/) {
	"use strict";

	QUnit.module("advanced UI5 unit test cases", {});

	QUnit.test("test a custom control (working in a 'real' XML view) in a Unit Test", function (assert) {
		var fnDone = assert.async();
		XMLView.create({
			viewName: "sap/ui/demo/todo/test/unit/view/AppWithInputCC"
		})
			.then(function (oView) {
				oView.placeAt("qunit-fixture");
				return oView;
			})
			.then(function (oView) {
				// acquiring the custom control
				var oController = oView.getController();
				var oInput = oController.byId("theCustomControlInput");
				// test it at rendering level!
				return assert.strictEqual(oInput.getPlaceholder(), "🤔", "Placeholder checked out fine");
			})
			.then(fnDone)
			.catch(function (oError) {
				// do sth clever here
				fnDone();
			})

	});

	/**
	 * programmatically issuing a browser-native event;
	 * largely taken from <sdk>/test-resources/sap/ui/core/qunit/dnd/DragAndDrop.qunit.js
	 *
	 * @param sEventType - any of https://developer.mozilla.org/en-US/docs/Web/API/DragEvent
	 * @returns {Event}
	 */
	function emulateDragDropEvent(sEventType) {
		var oEvent;

		if (typeof Event === "function") {
			oEvent = new Event(sEventType, {
				bubbles: true,
				cancelable: true
			});
		} else { // IE
			oEvent = document.createEvent("Event");
			oEvent.initEvent(sEventType, true, true);
		}

		oEvent.dataTransfer = new DataTransfer();

		return oEvent;
	}

	/**
	 * fire of the event constructed via {@link emulateDragDropEvent} on a UI5 control,
	 * optionally with x- and y-offsets on the virtual mouse click
	 *
	 * @param oControl - UI5 control in question
	 * @param sType - any of https://developer.mozilla.org/en-US/docs/Web/API/DragEvent
	 * @param mOffset
	 * @param mOffset.x - horizontal mouse offset
	 * @param mOffset.y - vertical mouse offset
	 */

	function triggerEvent(oControl, sType, mOffset) {
		var oDndEvent = emulateDragDropEvent(sType);
		if (mOffset) {
			oDndEvent.pageY = mOffset.y;
			oDndEvent.pageX = mOffset.x;
		}
		oControl.getDomRef().dispatchEvent(oDndEvent);
	}

	/**
	 * skeleton syntactic sugar implementation for spoken-like Drag'n'Drop operation
	 *
	 * @type {{drop: (function(): IFDnD), _dropped: null, dragOn: (function(*): IFDnD), _dragged: null, grab: (function(*): IFDnD), dragAfter: (function(*): IFDnD)}}
	 */
	var IFDnD = {
		_dragged: null,
		_dropped: null,
		/**
		 * start a Drag'n'Drop operation by picking up a control
		 *
		 * @param oControl - UI5 control
		 * @returns {IFDnD}
		 */
		grab: function (oControl) {
			this._dragged = oControl;
			triggerEvent(this._dragged, "dragstart");
			return this;
		},

		/**
		 * move a UI5 control previously {@link grab}bed on top of this one here
		 * @param oControl - UI5 control
		 * @returns {IFDnD}
		 */
		dragOn: function (oControl) {
			this._dropped = oControl;
			triggerEvent(this._dropped, "dragenter");
			triggerEvent(this._dropped, "dragover");
			return this;
		},

		/**
		 * move a UI5 control previously {@link grab}bed on right after this one here ("between")
		 * @param oControl - UI5 control
		 * @returns {IFDnD}
		 */
		dragAfter: function (oControl) {
			this._dropped = oControl;
			var oOffset = jQuery(oControl.getDomRef()).offset();
			var iOffSetY = oOffset.top + jQuery(oControl.getDomRef()).height();
			triggerEvent(this._dropped, "dragenter");
			triggerEvent(this._dropped, "dragover", {y: iOffSetY, x: 0});
			return this;
		},

		/**
		 * drop the previously {@link grab}bed UI5 control
		 * @returns {IFDnD}
		 */
		drop: function () {
			triggerEvent(this._dropped, "drop");
			triggerEvent(this._dropped, "dragend");
			return this;
		}
	};

	QUnit.test("testing Drag and Drop", function (assert) {

		var fnDone = assert.async(2); // expecting 2 async asserts!

		XMLView.create({
			viewName: "sap/ui/demo/todo/test/unit/view/DragAndDrop"
		})
			.then(function (oView) {
				oView.placeAt("qunit-fixture");
				return oView;
			})
			.then(function (oView) {
				var oController = oView.getController();
				var oList = oController.byId("theList");

				// we need to stay in the rendering cycle for drag and drop,
				// requiring a valid DOM
				// -> view needs to be rendered first before we can drag and drop anything
				oView.attachAfterRendering(function () {

					// dragging the first list item onto the fourth one
					// -> will be inserted before the fourth one
					IFDnD
						.grab(oList.getItems()[0])
						.dragOn(oList.getItems()[3])
						.drop();

					assert.strictEqual(oList.getItems()[0].getTitle(), "item 1", "1 is the first item");
					assert.strictEqual(oList.getItems()[2].getTitle(), "item 0", "0 is at position 3");

					// drag the next-to-last after the last list item
					IFDnD
						.grab(oList.getItems()[3])
						.dragAfter(oList.getItems()[4])
						.drop();

					assert.strictEqual(oList.getItems()[4].getTitle(), "item 3", "3 moved after 4!")
					fnDone();
				});
			})
			.then(fnDone)
			.catch(function (oError) {
				// do sth clever here
				fnDone();
			})

	});

});
