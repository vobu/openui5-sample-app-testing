// noinspection JSClosureCompilerSyntax
/**
 * @namespace
 * @name sap.ui.demo.todo
 */
sap.ui.define([
		"sap/m/Input"
	],
	/**
	 * @param {sap.m.Input} Input class of UI5
	 *
	 * @returns {sap.ui.demo.todo.control.Input} custom Input field
	 */
	function (Input) {
		"use strict";

		/**
		 * custom Input field uses calculation rules and/or values for displaying content.
		 *
		 * @name sap.ui.demo.todo.control.Input
		 * @extends sap.m.Input
		 */
		// noinspection JSClosureCompilerSyntax
		return Input.extend("sap.ui.demo.todo.control.Input", /** @lends sap.ui.demo.todo.control.Input.prototype */ {


			/**
			 * re-use renderer from sap.m.Input
			 */
			renderer: {},

			/**
			 * initialize control
			 */
			init: function () {
				Input.prototype.init.call(this);
				this.setPlaceholder("🤔");
			}

		});
	}
);
