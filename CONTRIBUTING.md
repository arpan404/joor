# Contribution Guidelines for Joor

Thank you for your interest in contributing to Joor! This document outlines the process and standards for contributing, ensuring a smooth collaboration experience.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Reporting Security Vulnerabilities](#reporting-security-vulnerabilities)
- [Style Guide](#style-guide)
- [Setup & Development Workflow](#setup--development-workflow)
- [Folder Structure](#folder-structure)
- [Branching and Pull Request Process](#branching-and-pull-request-process)
- [Additional Resources](#additional-resources)
- [Online Documentation](#online-documentation)
- [Discord Community](#discord-community)

## Code of Conduct

Please follow the guidelines in our [CODE_OF_CONDUCT.md](../pro/CODE_OF_CONDUCT.md) located in the pro branch. This document ensures a friendly, respectful, and productive environment for all contributors.

## Reporting Security Vulnerabilities

For any security issues, please refer to our [SECURITY.md](SECURITY.md) file which provides detailed instructions on how to report vulnerabilities responsibly.

## Style Guide

Contributors must adhere to the guidelines defined in [STYLEGUIDE.md](STYLEGUIDE.md). This document covers:

- Code formatting
- Writing uniform code styles
- Commit message conventions
- Pull request and discussion etiquette

## Setup & Development Workflow

To ensure consistency across development environments, please follow these steps:

1. **Environment Setup**
   - Ensure you have Node.js version **22.13.0** or any LTS version above **18** installed.
2. **Cloning and Setup**

   - Fork the repository on GitHub.
   - Clone your fork to your local machine:
     ```
     git clone https://github.com/<your-username>/joor.git
     ```
   - Navigate to the repository's directory and run:
     ```
     npm run setup
     ```

3. **Building the Project**

   - Execute the build process:
     ```
     npm run build
     ```
   - This command will create a `release` folder. Navigate into it and run:
     ```
     cd release
     npm run link
     ```

4. **Linking Joor for Testing**

   - Go to the desired playground folder:
     ```
     cd dev/playground/ground*  # Choose your preferred ground
     npm link joor
     ```
   - Note: If you install any packages via npm, the linkage may break. You will need to re-link using the above steps.

5. **Testing and Linting**
   - Run tests using:
     ```
     npm run test
     ```
   - For lint checks and auto-fixing:
     ```
     npm run lint
     npm run lint:fix
     ```
   - For code formatting:
     ```
     npm run format
     ```

## Folder Structure

- **README.md**: Introduction and overall information.
- **CONTRIBUTING.md**: Guidelines for contributing (this document).
- **CODE_OF_CONDUCT.md**: Code of conduct, available on the pro branch.
- **SECURITY.md**: Reporting procedures for security vulnerabilities.
- **STYLEGUIDE.md**: Coding style and contribution standards.
- **dev/**: Contains playgrounds and testing environments.
- **release/**: Output directory post-build containing the linked package.

## Branching and Pull Request Process

To maintain a clear and consistent workflow:

1. **Fork** the repository from GitHub.
2. **Clone** your fork locally.
3. **Create a new branch** following the naming pattern:
   ```
   username-bug-fix-(issue-number)
   ```
   Alternatively, for new features:
   ```
   username-new-feature-(short-description)
   ```
4. Commit your changes following guidelines in the [STYLEGUIDE.md](https://github.com/socioy/joor/blob/pro/STYLEGUIDE.md).
5. Open a pull request (PR) describing your changes with sufficient context and reference any related issues.

## Additional Resources

- **Project's main documentation:** Refer to [README.md](https://github.com/socioy/joor/blob/pro/README.md) for the full introduction and setup instructions.
- **Code of Conduct:** Enforced via [CODE_OF_CONDUCT.md](https://github.com/socioy/joor/blob/pro/CODE_OF_CONDUCT.md) in the pro branch.
- **Security Policies:** See [SECURITY.md](SECURITY.md) for detailed information on reporting vulnerabilities.

## Online Documentation

- Visit our documentation site: [joor.socioy.com](http://joor.socioy.com)
- Explore project markdown files on the pro branch:
  - [README.md](https://github.com/socioy/joor/blob/pro/README.md)
  - [CONTRIBUTING.md](https://github.com/socioy/joor/blob/pro/CONTRIBUTING.md)
  - [CODE_OF_CONDUCT.md](https://github.com/socioy/joor/blob/pro/CODE_OF_CONDUCT.md)
  - [SECURITY.md](https://github.com/socioy/joor/blob/pro/SECURITY.md)
  - [STYLEGUIDE.md](https://github.com/socioy/joor/blob/pro/STYLEGUIDE.md)

## Discord Community

For discussion or any help, join our Discord server here: [https://discord.gg/eepjRJJD6c](https://discord.gg/eepjRJJD6c)
