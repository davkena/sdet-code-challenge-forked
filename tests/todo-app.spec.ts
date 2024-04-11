import { test, expect, type Page } from '@playwright/test';
import { checkNumberOfCompletedTodosInLocalStorage, checkNumberOfTodosInLocalStorage, checkTodosInLocalStorage } from '../src/todo-app'

test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
});

const TODO_ITEMS = [
  'complete code challenge for reach',
  'ensure coverage for all items is automated'
];

test.describe('Create New Todo', () => {
  test('should be able to create new items on the page', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo.
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Make sure the list only has one todo item.
    await expect(page.getByTestId('todo-title')).toHaveText([
      TODO_ITEMS[0]
    ]);

    // Create 2nd todo.
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Make sure the list now has two todo items.
    await expect(page.getByTestId('todo-title')).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[1]
    ]);

    await checkNumberOfTodosInLocalStorage(page, 2);
  });
  
  test('new todo item should appear last on the list', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.locator('input.new-todo');

    // Assuming TODO_ITEMS contains items you want to add before the test case
    for (const item of TODO_ITEMS) {
      await newTodo.fill(item);
      await newTodo.press('Enter');
    }

    // Add a new todo item
    const newTodoItem = 'check the new todo item appears last';
    await newTodo.fill(newTodoItem);
    await newTodo.press('Enter');

    // Retrieve all todo items displayed on the page
    const todoItems = await page.locator('label[data-testid="todo-title"]').allInnerTexts();

    // Check if the last todo item in the list is the new todo item
    await expect(todoItems.at(-1)).toBe(newTodoItem);
  });
});
