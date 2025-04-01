# Contributing to nuxt-dev-console

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to nuxt-dev-console. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps which reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots if possible
- Include your environment details (OS, Node.js version, npm version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain which behavior you expected to see instead
- Explain why this enhancement would be useful
- List some other packages where this enhancement exists, if applicable

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Follow the JavaScript styleguide
- Include thoughtfully-worded, well-structured tests
- Document new code
- End all files with a newline

## Development Process

1. Fork the repo
2. Create a new branch from `main`:
   ```bash
   git checkout -b feature/my-feature
   # or
   git checkout -b fix/my-fix
   ```
3. Make your changes
4. Run the tests:
   ```bash
   npm run test
   ```
5. Run the linter:
   ```bash
   npm run lint
   ```
6. Push to your fork and submit a pull request

### Development Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/your-username/nuxt-dev-console.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a branch for your changes:
   ```bash
   git checkout -b my-feature
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the module
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run format` - Format code with Prettier

## Style Guide

### JavaScript

- Use modern JavaScript features
- Follow the ESLint configuration
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### Documentation

- Use Markdown for documentation
- Keep language clear and concise
- Include code examples where appropriate
- Update README.md with any necessary changes
- Document any new features in the CHANGELOG.md

## Additional Notes

### Issue and Pull Request Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing to nuxt-dev-console! 🚀
