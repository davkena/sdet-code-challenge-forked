import { test, expect, type Page } from '@playwright/test';
import { checkNumberOfCompletedTodosInLocalStorage, checkNumberOfTodosInLocalStorage, checkTodosInLocalStorage, checkTodoNotInLocalStorage, checkTodoCompletedInLocalStorage } from '../src/todo-app'
import { TodoPage } from './pages/todoPage';


test.beforeEach(async ({ page }) => {
  todoPage = new TodoPage(page);
  await todoPage.goto();
});

let todoPage: TodoPage;
const TODO_ITEMS = [
  'complete code challenge for reach',
  'ensure coverage for all items is automated'
];

test.describe('Create New Todo', () => {
  test('should be able to create new items on the page', async ({ page }) => {
    // Create the first todo item 
    await todoPage.addTodoItem(TODO_ITEMS[0]);

    // Assert that the first item in the todo list matches the expected text
    expect(await todoPage.getLastTodoItemText()).toBe(TODO_ITEMS[0]);

    // Create the second todo item 
    await todoPage.addTodoItem(TODO_ITEMS[1]);

    // Retrieve and check all current todo items to ensure both are present
    expect(await todoPage.todoItems.allInnerTexts()).toEqual(TODO_ITEMS);

    // Check the number of todos in local storage matches expected
    await checkNumberOfTodosInLocalStorage(page, 2);
  });

  test('new todo item should appear last on the list', async ({ page }) => {
    // Add predefined todo items to the list
    for (const item of TODO_ITEMS) {
      await todoPage.addTodoItem(item);
    }

    // Add a new todo item 
    const newTodoItem = 'check the new todo item appears last';
    // Add the new todo item using TodoPage class method
    await todoPage.addTodoItem(newTodoItem);

    // Retrieve the new todo item
    const todoItemsTexts = await todoPage.todoItems.allInnerTexts();

    // Check if the last todo item in the list matches the newly added item
    expect(todoItemsTexts.at(-1)).toBe(newTodoItem);
  });

  test('edit a todo item and verify it updates', async ({ page }) => {
    // Create a new todo item
    await todoPage.addTodoItem('Original Todo');

    // Verify that the todo item exists in local storage
    await checkTodosInLocalStorage(page, 'Original Todo');

    // Edit the first todo item
    await todoPage.editFirstTodoItem('Updated Todo');

    // Check if the todo item is updated on the page
    expect(await todoPage.todoItems.first().innerText()).toBe('Updated Todo');

    // Check if the updated todo item is present in local storage
    await checkTodosInLocalStorage(page, 'Updated Todo');
  });

  test('should delete a todo item', async ({ page }) => {
    // Add a new todo item
    const todoToDelete = 'Todo to be deleted';
    await todoPage.addTodoItem(todoToDelete);

    // Verify the new todo item was added successfully
    expect(await todoPage.isTodoItemPresent(todoToDelete)).toBe(true);

    // Delete the todo item and hover over the item to show the delete button
    await todoPage.todoList.locator(`text="${todoToDelete}"`).hover();
    await todoPage.page.locator('button.destroy').click();

    // Verify the todo item is removed from the page
    const isPresentAfterDelete = await todoPage.isTodoItemPresent(todoToDelete);
    expect(isPresentAfterDelete).toBe(false);

    // Ensure the todo is removed from local storage
    await checkTodoNotInLocalStorage(page, todoToDelete);
  });

  test('todo item is marked as completed', async ({ page }) => {

    const todoText = 'Complete me';
    // Add a new todo item
    await todoPage.addTodoItem(todoText);

    // Mark the todo item as completed
    await todoPage.toggleCompletionOfTodoItem();

    // Verify it is completed
    expect(await todoPage.isTodoItemCompleted(0)).toBe(true);

    // Verify it is marked with a green check mark and crossed off
    expect(await todoPage.isTodoItemMarkedAsCompleted(0)).toBe(true);

    // Verify the todo item is marked as completed in local storage
    await checkTodoCompletedInLocalStorage(page, todoText);

    // Verify the number of completed todos in local storage
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  });

  test('active list shows only active todo items', async ({ page }) => {
    const todoItemText = 'Todo to be completed';
    const todoItemText2 = 'Todo not to be completed';
    // Add a new todo item
    await todoPage.addTodoItem(todoItemText);
    await todoPage.addTodoItem(todoItemText2);

    // Mark the new todo item as completed
    await todoPage.toggleCompletionOfTodoItem();

    // Navigate to the Active list
    await todoPage.navigateToActiveList();

    // Verify that the completed todo item is not present
    expect(await todoPage.isTodoItemPresent(todoItemText)).toBe(false);
    expect(await todoPage.isTodoItemPresent(todoItemText2)).toBe(true);
  });

  test('completed todo item is removed when clearing completed', async ({ page }) => {
    // Add a new todo item
    const todoText = 'Complete and clear me';
    await todoPage.addTodoItem(todoText);

    // Mark the new todo item as completed
    await todoPage.toggleCompletionOfTodoItem(); // Assuming it's the first/only item

    // Clear all completed todo items
    await todoPage.clearCompletedTodos();

    // Verify the completed item is removed from the list
    expect(await todoPage.isTodoItemPresent(todoText)).toBe(false);

    // Verify the item count in local storage is decreased
    await checkNumberOfTodosInLocalStorage(page, 0);

    /* 
    // The part about moving the item to the Completed list is commented out, as the item is removed, not moved
    // This is consistent with the app's behavior and the original test expectations
     await page.locator('a[href="#/completed"]').click();
     await expect(page.locator('text="Complete and clear me"')).toBeVisible();
     */
  });
});
