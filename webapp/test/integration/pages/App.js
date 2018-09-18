sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/demo/todo/test/integration/pages/Common",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/actions/Press",
	"sap/ui/test/matchers/I18NText"
], function (Opa5, Common, AggregationLengthEquals, PropertyStrictEquals, Properties, EnterText, Press, I18NText) {
	"use strict";

	var sViewName = "sap.ui.demo.todo.view.App";
	var sAddToItemInputId = "addTodoItemInput";
	var sSearchTodoItemsInputId = "searchTodoItemsInput";
	var sItemListId = "todoList";
	var sClearCompletedId = "clearCompleted";
	var sItemsLeftLabelId = "itemsLeftLabel";
	var sItemsLeftLabelIdText = "itemsLeftLabelText";

	Opa5.createPageObjects({
		onTheAppPage: {

			baseClass: Common,

			actions: {
				byId: function () {
					return this.waitFor({
						id: "controlId",
						viewName: "sap.ui.demo.todo.App",
						success: function (oControl) {
							/* assert sth on oControl */
						}
					})

				},
				withHelpOfMatchers: function (sText) {
					return this.waitFor({
						controlType: "sap.m.Button",
						viewName: "sap.ui.demo.todo.App",
						// equire sap.ui.test.matchers.PropertyStrictEquals and
						// use as PropertyStrictEquals
						matchers: new PropertyStrictEquals({
							name: "text",
							value: sText
						}),
						success: function (oButton) {
							/* assert sth on oControl */
						}
					})
				},
				inPopup: function (sControlTypeInPopup, sText) {
					return this.waitFor({
						controlType: sControlTypeInPopup,
						// require sap.ui.test.matchers.PropertyStrictEquals and
						// use as PropertyStrictEquals
						matchers: new PropertyStrictEquals({
							name: "text",
							value: sText
						}),
						searchOpenDialogs: true,
						success: function (oButton) {
							/* assert sth on oButton */
						}
					})
				},
				iEnterTextForNewItemAndPressEnter: function (text) {
					return this.waitFor({
						id: sAddToItemInputId,
						viewName: sViewName,
						actions: [new EnterText({text: text})],
						errorMessage: "The text cannot be entered"
					});
				},
				iEnterTextForSearchAndPressEnter: function (sText) {
					return this.waitFor({
						id: sSearchTodoItemsInputId,
						viewName: sViewName,
						// require sap.ui.test.actions.EnterText and
						// use as EnterText
						actions: [new EnterText({text: sText})],
						errorMessage: "The text cannot be entered"
					});
				},
				iSelectTheLastItem: function (bSelected) {
					return this.waitFor({
						id: sItemListId,
						viewName: sViewName,
						// selectionChange
						actions: [function (oList) {
							var iLength = oList.getItems().length;
							var oListItem = oList.getItems()[iLength - 1];
							this._triggerCheckboxSelection(oListItem, bSelected);
						}.bind(this)],
						errorMessage: "Last checkbox cannot be pressed"
					});
				},
				iSelectAllItems: function (bSelected) {
					return this.waitFor({
						id: sItemListId,
						viewName: sViewName,
						actions: [function (oList) {

							oList.getItems().forEach(function (oListItem) {
								this._triggerCheckboxSelection(oListItem, bSelected)

							}.bind(this));
						}.bind(this)],
						errorMessage: "checkbox cannot be pressed"
					});
				},
				_triggerCheckboxSelection: function (oListItem, bSelected) {
					//determine existing selection state and ensure that it becomes <code>bSelected</code>
					if (oListItem.getSelected() && !bSelected || !oListItem.getSelected() && bSelected) {
						var oPress = new Press();
						//search within the CustomListItem for the checkbox id ending with 'selectMulti-CB'
						oPress.controlAdapters["sap.m.CustomListItem"] = "selectMulti-CB";
						oPress.executeOn(oListItem);
					}
				},
				iClearTheCompletedItems: function () {
					return this.waitFor({
						id: sClearCompletedId,
						viewName: sViewName,
						actions: [new Press()],
						errorMessage: "checkbox cannot be pressed"
					});
				},
				iFilterForItems: function (filterKey) {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.SegmentedButtonItem",
						matchers: [
							new Properties({key: filterKey})
						],
						actions: [new Press()],
						errorMessage: "SegmentedButton can not be pressed"
					});
				}
			},

			assertions: {
				iShouldSeeTheItemBeingAdded: function (iItemCount, sLastAddedText) {
					return this.waitFor({
						id: sItemListId,
						viewName: sViewName,
						matchers: [new AggregationLengthEquals({
							name: "items",
							length: iItemCount
						}), function (oControl) {
							var iLength = oControl.getItems().length;
							var oInput = oControl.getItems()[iLength - 1].getContent()[0];
							return new PropertyStrictEquals({
								name: "value",
								value: sLastAddedText
							}).isMatching(oInput);
						}],
						success: function () {
							Opa5.assert.ok(true, "The table has " + iItemCount + " item(s), with '" + sLastAddedText + "' as last item");
						},
						errorMessage: "List does not have expected entry '" + sLastAddedText + "'."
					});
				},
				iShouldSeeTheLastItemBeingCompleted: function (bSelected) {
					return this.waitFor({
						id: sItemListId,
						viewName: sViewName,
						matchers: [function (oControl) {
							var iLength = oControl.getItems().length;
							var oInput = oControl.getItems()[iLength - 1].getContent()[0];
							return bSelected && !oInput.getEnabled() || !bSelected && oInput.getEnabled();
						}],
						success: function () {
							Opa5.assert.ok(true, "The last item is marked as completed");
						},
						errorMessage: "The last item is not disabled."
					});
				},
				iShouldSeeAllButOneItemBeingRemoved: function (sLastItemText) {
					return this.waitFor({
						id: sItemListId,
						viewName: sViewName,
						matchers: [new AggregationLengthEquals({
							name: "items",
							length: 1
						}), function (oControl) {
							var oInput = oControl.getItems()[0].getContent()[0];
							return new PropertyStrictEquals({
								name: "value",
								value: sLastItemText
							}).isMatching(oInput);
						}],
						success: function () {
							Opa5.assert.ok(true, "The table has 1 item, with '" + sLastItemText + "' as Last item");
						},
						errorMessage: "List does not have expected entry '" + sLastItemText + "'."
					});
				},
				iShouldSeeItemLeftCount: function (iNumberItemsLeft) {
					// pick appropriate i18n label based on integer condition
					var oItemLeftMatcher;
					if (iNumberItemsLeft === 1) {
						oItemLeftMatcher = new I18NText({
							propertyName: "text",
							key: "ITEM_LEFT"
						});
					} else {
						oItemLeftMatcher = new I18NText({
							propertyName: "text",
							key: "ITEMS_LEFT"
						});
					}

					// multi-lang match of label text
					return this.waitFor({
						id: sItemsLeftLabelIdText,
						viewName: sViewName,
						matchers: oItemLeftMatcher,
						success: function () {
							Opa5.assert.ok(true, "" + iNumberItemsLeft + " items left");
						},
						errorMessage: "Items are not selected."
					});
				},
				iShouldSeeItemCount: function (iItemCount) {
					return this.waitFor({
						id: sItemListId,
						viewName: sViewName,
						matchers: [new AggregationLengthEquals({
							name: "items",
							length: iItemCount
						})],
						success: function () {
							Opa5.assert.ok(true, "The table has " + iItemCount + " item(s)");
						},
						errorMessage: "List does not have expected number of items '" + iItemCount + "'."
					});
				}
			}

		}
	});

});
