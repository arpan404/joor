# Joor Style Guide & Best Practices

## General Code Conventions

1. **Types**:

   - Type names must be in **UPPERCASE**.  
     Example:
     ```typescript
     type USER = { id: string; name: string };
     ```

2. **Variables**:

   - Variable names should be written in **camelCase**.  
     Example:
     ```typescript
     let userName = 'John Doe';
     let userId = 123;
     ```

3. **Constants**:

   - Constants should be written in **camelCase**.  
     Example:
     ```typescript
     const maxUsers = 100;
     const apiKey = 'abc123';
     ```

4. **Function and Method Names**:

   - Functions and methods should be in **camelCase**.  
     Example:
     ```typescript
     function getUserDetails(userId: string) { ... }
     ```

5. **Class Names**:

   - Class names must be written in **PascalCase**.  
     Example:
     ```typescript
     class UserProfile { ... }
     ```

6. **Export**:

   - **Exports** should always be placed at the **end** of the file.  
     Example:
     ```typescript
     class User { ... }
     export { User };
     ```

7. **Indentation**:

   - Use **2 spaces** for indentation, no tabs.  
     Example:
     ```typescript
     function getUser() {
       return { name: 'John' };
     }
     ```

8. **Line Length**:

   - Lines should not exceed **80 characters** to enhance readability, except for long URLs or import statements.

9. **Comments**:

   - Use **single-line comments** for short explanations and **multi-line comments** for detailed descriptions.  
     Example:

     ```typescript
     // This function gets the user details by ID
     function getUserDetails(userId: string) { ... }

     /**
      * This function retrieves all user data.
      * It supports pagination and filtering by date range.
      */
     function getAllUsers(page: number, filter: string) { ... }
     ```

10. **Arrow Functions**:

    - **Prefer using arrow functions** for most work, as they are more concise and provide a consistent `this` behavior.  
      Example:

      ```typescript
      // Arrow function for simple use cases
      const getUser = (id: string) => { ... };

      // Avoid traditional function declarations when possible
      function getUserTraditional(id: string) { ... }
      ```

---

## Git Commit Messages

Following a consistent format for commit messages helps improve the clarity and maintainability of the project.

1. **Commit Message Format**:

   - Use **imperative mood** in your commit messages (e.g., "Add feature" instead of "Added feature").
   - **Tag** the commit type, such as:
     - `feat:` for new features
     - `fix:` for bug fixes
     - `refactor:` for code changes that neither fix a bug nor add a feature
     - `docs:` for documentation updates
     - `test:` for adding or updating tests
     - `chore:` for routine tasks such as refactoring or cleaning up code
     - `style:` for changes that do not affect functionality but improve code readability or structure

   Examples:

   ```text
   feat: Add authentication API
   fix: Correct typo in README
   refactor: Update user service logic
   docs: Add new section on security best practices
   ```

2. **Bug and Issue Tags**:

   - For issues, always prefix with **#Bug** or **#Issue** to provide clarity. Additionally, use specific tags when applicable to further classify the issue. Here are some common tags and their examples:

     - **#Bug**: Issues related to errors or malfunctions in the application.
       ```text
       #Bug: Fixed error with user login
       #Bug: Unable to save user settings
       ```
     - **#Issue**: Generic issues or tasks that don't fall under a specific category.
       ```text
       #Issue: Resolved API timeout problem
       #Issue: Unexpected behavior in data processing
       ```
     - **#Feature**: Requests for new functionality or enhancements.
       ```text
       #Feature: Add multi-factor authentication
       #Feature: Implement dark mode for the UI
       ```
     - **#Enhancement**: Suggestions to improve or optimize existing features.
       ```text
       #Enhancement: Improve error logging for API calls
       #Enhancement: Optimize database queries for faster response
       ```
     - **#Docs**: Issues related to documentation updates or corrections.
       ```text
       #Docs: Update installation instructions in README
       #Docs: Clarify API usage in the documentation
       ```
     - **#Test**: Issues related to tests, test coverage, or improvements in the testing suite.
       ```text
       #Test: Add missing tests for user service
       #Test: Fix failing integration tests
       ```
     - **#Chore**: Tasks related to project maintenance, refactoring, or routine updates.
       ```text
       #Chore: Refactor file structure for better organization
       #Chore: Update dependency versions
       ```
     - **#Help**: Requests for assistance or guidance on a particular issue.
       ```text
       #Help: Need assistance with setting up the development environment
       #Help: How to implement caching in the current framework?
       ```
     - **#Confusion**: For discussions or clarifications when something is unclear.
       ```text
       #Confusion: Uncertain about the expected behavior of the authentication flow
       #Confusion: How should error handling be structured in our API?
       ```

## Pull Request Guidelines

When submitting a pull request (PR), please follow these guidelines to ensure a smooth review process:

- **Title & Description**:

  - Provide a clear and concise title for your PR.
  - Include a detailed description of the changes, referencing any related issues (e.g., `#Bug`, `#Feature`, etc.).

- **Scope**:

  - Keep pull requests small and focused on a single task or feature.
  - Avoid bundling unrelated changes together.

- **Rebasing & Squashing**:

  - **Rebase your branch** on the latest version of the base branch to resolve conflicts and ensure your PR is up-to-date.
  - **Squash your commits** so that only one meaningful commit is present in the final pull request. This helps maintain a clean and readable commit history.

- **Testing**:

  - Ensure that your changes pass all existing tests.
  - Add new tests if your PR introduces new functionality or fixes a bug.

- **Documentation**:

  - Update documentation as needed to reflect your changes.
  - Include any additional information or context in the PR description.

- **Style & Conventions**:

  - Ensure your code adheres to the **Joor Style Guide**.
  - Remember that formatting is handled automatically by **ESLint** and **Prettier**.

- **Review & Feedback**:

  - Be open to feedback and ready to make necessary adjustments.
  - Address all comments from reviewers before merging your PR.

- **Merging**:
  - Do not merge your PR until it has been approved by at least one other contributor.
  - Ensure your branch is up-to-date with the base branch before merging.

## Additional Guidelines

- **Automatic Formatting**:  
  Formatting is handled automatically when you commit your changes through **ESLint** and **Prettier**.
- **ESLint Checks**:  
  Do not disable ESLint checks unless there is absolutely no other way. Maintaining these checks ensures that our code stays consistent and adheres to our style guide.

## Conclusion

By following the **Joor Style Guide** and adhering to the best practices outlined here, you can contribute to the development of secure and maintainable code. For any questions or concerns regarding security or the style guide, feel free to contact us at [joor@socioy.com](mailto:joor@socioy.com) or join the discussion on [Discord](https://discord.gg/eepjRJJD6c).

We appreciate your contributions and efforts to make Joor a more robust and secure framework.
