# Reach SDET Code Challenge

## Reach Financial's take-home code challenge for Software Development Engineer in Test candidates.

### Have a question?

* For any code challange-related questions reach out to your Reach recruiting contact
* Documentation for playwright can be found [here](https://playwright.dev/docs)

---
### How do I get set up?

1.  Fork this repository
2.  Install node/npm on your machine if you haven't already
3.  npm install required packages for the repo 
4.  Test scripts can be found in package.json. Feel free to modify these if you need to.
---
### Code Challenge Instructions

1. The only requirement is that you complete the test cases listed below using Playwright. Design patterns, folder structure are up to you.
2. Commit frequently.
3. When you're done, create a pull request within your forked repository, and share the link to the PR with Lindsay Helmus.
---
### Test Cases

The app you’ll be testing is the example React todomvc app located here – https://todomvc.com/examples/react/#/ 

#### Scenario
As a user of the [React todomvc](https://todomvc.com/examples/react/#/) app, I want to be able to add, delete and mark todo items as complete

#### Test case #1 

`Given I am a user of todomvc`\
`When I create a new todo item`\
`Then it appears last on my todo list`
 
#### Test case #2

`Given I have created a todo item`\
`When I edit a todo item`\
`Then the todo item gets updated with the new changes` 

#### Test case #3

`Given I have created a todo item`\
`When I delete a todo item using the red X`\
`Then the todo item is removed from my todo list`
 
#### Test case #4

`Given I have created a todo item`\
`When I mark a todo item as completed`\
`Then it is marked with a green check mark`\
`And it is crossed off my todo list with a Strikethrough` 

#### Test case #5

`Given I have marked a todo item as complete`\
`When I view the Active list`\
`Then only Active (Not Completed) todo items are shown`
 
#### Test case #6

`Given I have marked a todo item as complete`\
`When I click “Clear Completed”`\
`Then the completed todo item is removed from my todo list`\
`And the todo item is moved to the Completed list` 
