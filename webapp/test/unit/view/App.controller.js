sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	'use strict';

	return Controller.extend('sap.ui.demo.todo.test.unit.view.App', {

		onDrop: function (oEvent) {
			var oList = oEvent.getSource().getParent();
			var aOriginalAggregation = oList.getAggregation("items");
			var oDraggedControl = oEvent.getParameter("draggedControl");
			var oDroppedControl = oEvent.getParameter("droppedControl");

			// we work on a clone, not the original
			var aNewAggregation = aOriginalAggregation.slice(0);

			// hey, UI5 >= 1.60 has all them ES6 polyfills,
			// including Array.prototype.findIndex :)
			var iIndexDroppedControl = aOriginalAggregation.findIndex(function (oControl) {
				return oControl.getId() === oDroppedControl.getId();
			});

			var iIndexDraggedControl = aNewAggregation.findIndex(function (oControl) {
				return oControl.getId() === oDraggedControl.getId();
			});
			// substitue dragged control with a placeholder
			// that we'll remove later
			aNewAggregation.splice(iIndexDraggedControl, 1, "remove me!");

			// insert dragged control at appropriate position in
			// new items aggregation
			switch (oEvent.getParameter("dropPosition")) {
				case "On":
				case "Before":
					aNewAggregation.splice(iIndexDroppedControl, 0, oDraggedControl);
					break;
				case "After":
					aNewAggregation.splice(iIndexDroppedControl + 1, 0, oDraggedControl);
					break;
				default:
					aNewAggregation.splice(iIndexDroppedControl, 0, oDraggedControl);
			}

			// find the dummy element we inserted earlier
			// and remove it
			var iIndexOfDummyToRemove = aNewAggregation.findIndex(function (vValue) {
				return vValue === "remove me!"
			});
			aNewAggregation.splice(iIndexOfDummyToRemove, 1);

			// re-build list aggregation
			oList.removeAllItems();
			aNewAggregation.forEach(function (oItem) {
				oList.addItem(oItem);
			})
		}
	});

});
