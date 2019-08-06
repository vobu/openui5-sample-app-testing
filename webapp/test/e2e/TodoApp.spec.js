/*global protractor*/

describe('TodoApp', function () {
	const viewNS = 'sap.ui.demo.todo.view.';
	it('should see the todo list w/ 2 items', function () {
		const List = element(by.control({
			id: 'todoList',
			viewName: `${viewNS}App`,
			aggregationFilled: {
				name: 'items'
			}
			//// doesn't work (currently?)
			// aggregationLengthEquals: {
			// 	name: 'items',
			// 	value: 2
			// }
		}));

		const ListItems = element.all(by.control({
			controlType: 'sap.m.CustomListItem',
			viewName: `${viewNS}App`
		}));

		expect(List.getAttribute("id")).toContain("todoList");
		expect(ListItems.count()).toEqual(2);

		// concise Promise style
		// List.getAttribute("id")
		// 	.then(sId => expect(sId).toContain("todoList"))
		// 	.then(() => ListItems.count())
		// 	.then(iListItems => expect(iListItems).toEqual(2))
		// 	.catch(oError => {// oh no!
		// 		console.error(oError);
		// 	})

		// verbose Promise style
		// List.getAttribute("id").then(sId => {
		// 	return expect(sId).toContain("todoList");
		// }).then(() => {
		// 	return ListItems.count();
		// }).then(iListItems => {
		// 	return expect(iListItems).toEqual(2);
		// }).catch(oError => {
		// 	// oh no!
		// 	console.error(oError);
		// })

	});
	it('should filter the todo list, resulting in 1 item only', function () {
		// showcasing .click()
		const FilterButton = element(by.control({
			id: 'filterButton-active',
			viewName: `${viewNS}App`
		}));

		const ListItems = element.all(by.control({
			controlType: 'sap.m.CustomListItem',
			viewName: `${viewNS}App`
		}));

		FilterButton.click();
		expect(ListItems.count()).toEqual(1);

		// ListItems.count().then(iResult => {
		// 	"";
		// })
	});

	it("add a new todo list item 'sitFFM 2019'", function () {

		// showcasing .sendKeys() + Enter press
		const InputField = element(by.control({
			id: 'addTodoItemInput',
			viewName: `${viewNS}App`
		}));

		InputField.sendKeys("sitFFM 2019" + protractor.Key.ENTER);

		const Inputs = element.all(by.control({
			id: /^(?!.*addTodoItemInput)/, // nothing with an ID containing addTodoItemInput
			controlType: "sap.m.Input"
		}));

		const aResults = Inputs.map(oInput => oInput.asControl().getProperty("value"));


		expect(aResults).toContain("sitFFM 2019");

		// "debug" notation
		// aResults.then(vValue => {
		// 	"";
		// }).catch(oError => {
		// 	"";
		// })

	});

});
