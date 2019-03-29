describe('TodoApp', function () {
	var viewNS = 'sap.ui.demo.todo.view.';
	it('should see the todo list w/ 2 items', function () {
		var List = element(by.control({
			id: 'todoList',
			viewName: viewNS + 'App',
			aggregationFilled: {
				name: 'items'
			}
			//// doesn't work (currently?)
			// aggregationLengthEquals: {
			// 	name: 'items',
			// 	value: 2
			// }
		}));

		var ListItems = element.all(by.control({
			controlType: "sap.m.CustomListItem",
			viewName: viewNS + 'App'
		}));

		expect(List.getAttribute("id")).toContain("todoList");
		expect(ListItems.count()).toEqual(2);

		//// verbose Promise style
		// List.getAttribute("id").then( function (sId) {
		// 	return expect(sId).toContain("todoList");
		// }).then( function () {
		// 	return ListItems.count();
		// }).then( function (iListItems) {
		// 	return expect(iListItems).toEqual(2);
		// }).catch(function (oError) {
		// 	// oh no!
		// 	console.error(oError);
		// })

	});
	it('should filter the todo list, resulting in 1 item only', function () {
		// showcasing .click()
		var FilterButton = element(by.control({
			id: 'filterButton-active',
			viewName: viewNS + 'App'
		}));

		var ListItems = element.all(by.control({
			controlType: "sap.m.CustomListItem",
			viewName: viewNS + 'App'
		}));

		FilterButton.click();
		expect(ListItems.count()).toEqual(1);

		// ListItems.count().then(function (iResult) {
		// 	"";
		// })
	});

	it("add a new todo list item 'sitFFM 2019'", function () {

		// showcasing .sendKeys() + Enter press
		var InputField = element(by.control({
			id: 'addTodoItemInput',
			viewName: viewNS + 'App'
		}));

		InputField.sendKeys("sitFFM 2019" + protractor.Key.ENTER);

		var Inputs = element.all(by.control({
			id: /^(?!.*addTodoItemInput)/, // nothing with an ID containing addTodoItemInput
			controlType: "sap.m.Input"
		}));

		var aResults = Inputs.map(function (oInput) {
			return oInput.asControl().getProperty("value");
		});


		expect(aResults).toContain("sitFFM 2019");

		//// "debug" notation
		// aResults.then( function (vValue) {
		// 	"";
		// }).catch( function (oError) {
		// 	"";
		// })

	});

});
