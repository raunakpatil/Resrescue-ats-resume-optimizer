# Contributing to ResRescue

First off, thank you for considering contributing to ResRescue! It's people like you that make ResRescue such a great tool.

## Code of Conduct
By participating in this project, you are expected to uphold our standards of professional and respectful behavior.

## How Can I Contribute?

### Reporting Bugs
This section guides you through submitting a bug report for ResRescue. Following these guidelines helps maintainers understand your report, reproduce the behavior, and find related reports.
*   **Use the GitHub issue search** — check if the issue has already been reported.
*   **Check if the issue has been fixed** — try to reproduce it using the latest `main` branch.
*   Provide a clear and descriptive title for the issue.
*   Describe the exact steps to reproduce the problem in as many details as possible.

### Suggesting Enhancements
*   Use a clear and descriptive title for the issue to identify the suggestion.
*   Provide a step-by-step description of the suggested enhancement.
*   Explain why this enhancement would be useful to most users.

### Submitting Pull Requests
1.  **Fork the repo** and create your branch from `main`.
2.  **Branch naming**: Use a descriptive name (e.g., `feat/add-new-template`, `fix/ats-parsing-bug`).
3.  **Code Style**: 
    *   We use standard JavaScript with React 18.
    *   Ensure your code matches the existing style (e.g., using TailwindCSS for styling).
    *   Keep React components functional and use hooks.
4.  **Testing**: If you add a new feature, please ensure it works by testing it locally. Automated tests are coming soon!
5.  **Commit Messages**: Keep commit messages clear and concise (e.g., `feat: added new modern template`).
6.  **Push and Open a PR**: Push your branch to your fork and open a Pull Request against `main`.

## Local Development Setup

1.  Clone your fork:
    ```bash
    git clone https://github.com/YOUR_USERNAME/Resrescue-ats-resume-optimizer.git
    cd Resrescue-ats-resume-optimizer
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    *   Copy `.env.example` to `.env.local`
    *   Add your Google Gemini API key.
4.  Run the development server:
    ```bash
    npm run dev
    ```

Thank you for contributing!
