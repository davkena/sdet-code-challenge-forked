import { Page, Locator } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly newTodoInput: Locator;
  readonly todoList: Locator;
  readonly todoItems: Locator;
  readonly clearCompletedButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodoInput = page.locator('input.new-todo');
    this.todoList = page.locator('ul.todo-list');
    this.todoItems = page.locator('label[data-testid="todo-title"]');
    this.clearCompletedButton = page.locator('button', { hasText: 'Clear completed' });
  }

  async addTodoItem(todoText: string): Promise<void> {
    await this.newTodoInput.fill(todoText);
    await this.newTodoInput.press('Enter');
  }

  async getLastTodoItemText(): Promise<string> {
    const todoItemsText = await this.todoItems.allInnerTexts();
    return todoItemsText.at(-1) ?? "";
  }

  async isTodoItemPresent(todoText: string): Promise<boolean> {
    const todoItem = this.todoItems.filter({ hasText: todoText });
    return todoItem.isVisible();
  }

  async editFirstTodoItem(newText: string): Promise<void> {
    await this.todoItems.first().dblclick();
    const editInput = this.page.locator('input.edit:visible');
    await editInput.fill(newText);
    await editInput.press('Enter');
  }

  async toggleCompletionOfTodoItem(itemIndex: number = 0): Promise<void> {
    await this.page.locator('input.toggle').nth(itemIndex).click();
  }

  async clearCompletedTodos(): Promise<void> {
    await this.clearCompletedButton.click();
  }

  async navigateToActiveList(): Promise<void> {
    await this.page.locator('a[href="#/active"]').click();
  }

  async countVisibleTodos(): Promise<number> {
    return this.todoItems.count();
  }

}