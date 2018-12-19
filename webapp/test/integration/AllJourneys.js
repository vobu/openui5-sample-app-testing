_global = {};
// setup for switch between
// local JSON model (comment out both _global settings below)
// Mockserver-based OData model (uncomment both _global settings below)
_global.mockserver = true;
_global.mockserverParameters = jQuery.sap.getUriParameters();

sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/demo/todo/test/integration/pages/Common",
	"sap/ui/demo/todo/test/integration/TodoListJourney",
	"sap/ui/demo/todo/test/integration/SearchJourney",
	"sap/ui/demo/todo/test/integration/FilterJourney"
], function(Opa5, Common) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Common(),
		autoWait: true
	});

});
