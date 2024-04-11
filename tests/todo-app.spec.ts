import { test, expect, type Page } from '@playwright/test';
import { checkNumberOfCompletedTodosInLocalStorage, checkNumberOfTodosInLocalStorage, checkTodosInLocalStorage, checkTodoNotInLocalStorage, checkTodoCompletedInLocalStorage } from '../src/todo-app'
import { TodoPage } from './pages/todoPage';


test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  todoPage = new TodoPage(page);
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
    const todosTexts = await todoPage.todoItems.allInnerTexts();
    expect(todosTexts).toEqual(TODO_ITEMS);

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
    const firstItemText = await todoPage.todoItems.first().innerText();
    expect(firstItemText).toBe('Updated Todo');

    // Check if the updated todo item is present in local storage
    await checkTodosInLocalStorage(page, 'Updated Todo');
  });

  test('should delete a todo item', async ({ page }) => {
    // Add a new todo item
    const todoToDelete = 'Todo to be deleted';
    await todoPage.addTodoItem(todoToDelete);

    // Verify the new todo item was added successfully
    const isPresentBeforeDelete = await todoPage.isTodoItemPresent(todoToDelete);
    expect(isPresentBeforeDelete).toBe(true);

    // Delete the todo item and hover over the item to show the delete button
    const todoItemLocator = todoPage.todoList.locator(`text="${todoToDelete}"`);
    await todoItemLocator.hover();
    await todoPage.page.locator('button.destroy').click();

    // Verify the todo item is removed from the page
    const isPresentAfterDelete = await todoPage.isTodoItemPresent(todoToDelete);
    expect(isPresentAfterDelete).toBe(false);

    // Ensure the todo is removed from local storage
    await checkTodoNotInLocalStorage(page, todoToDelete);
  });

  test('todo item is marked as completed', async ({ page }) => {
    // Add a new todo item
    await page.locator('input.new-todo').fill('Complete me');
    await page.locator('input.new-todo').press('Enter');

    //  Mark the todo item as completed
    await page.locator('input.toggle').click();

    // Verify it is completed
    await expect(page.locator('li[data-testid="todo-item"].completed')).toHaveCount(1);

    // Verify it is marked with a green check mark
    await expect(page.locator('label[data-testid="todo-title"]')).toHaveCSS('background-image', /data:image\/svg\+xml/);

    //Verify it is crossed off
    await expect(page.locator('label[data-testid="todo-title"]')).toHaveCSS('text-decoration-line', 'line-through');

    // Verify the todo item is marked as completed in local storage
    await checkTodoCompletedInLocalStorage(page, 'Complete me');

    // Verify the number of completed todos in local storage
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);

  });

  test('active list shows only active todo items', async ({ page }) => {
    // Add a new todo item
    await page.locator('input.new-todo').fill('Todo to be completed');
    await page.locator('input.new-todo').press('Enter');

    // Mark the todo item as completed
    await page.locator('input.toggle').first().click();

    // Navigate to the Active list
    await page.locator('a[href="#/active"]').click();

    // Verify that the completed todo item is not present
    await expect(page.locator('label[data-testid="todo-title"]:has-text("Todo to be completed")')).not.toBeVisible();
  });

  test('completed todo item is removed when clearing completed', async ({ page }) => {
    // Add and complete a todo item
    await page.locator('input.new-todo').fill('Complete and clear me');
    await page.locator('input.new-todo').press('Enter');
    await page.locator('input.toggle').click();

    // Click “Clear Completed”
    await page.locator('button', { hasText: 'Clear completed' }).click();

    // Verify the completed item is removed from the list
    await expect(page.locator('text="Complete and clear me"')).toHaveCount(0);

    // Verify the item count in local storage decreases
    await checkNumberOfTodosInLocalStorage(page, 0);

    //And the todo item is moved to the Completed list
    // this part is commented out because the item is removed from the list and not moved to the Completed list in the app
    // await page.locator('a[href="#/completed"]').click();
    // await expect(page.locator('text="Complete and clear me"')).toBeVisible();
  });

});
