# Playwright Demo Project

A comprehensive end-to-end testing suite built with Playwright, featuring functional tests and visual regression testing for e-commerce web applications.

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
  - [Local Execution](#local-execution)
  - [Docker Execution](#docker-execution)
- [Visual Comparison Testing](#visual-comparison-testing)
- [GitHub Actions Workflow](#github-actions-workflow)
- [Test Configuration](#test-configuration)
- [Page Object Model](#page-object-model)
- [Dockerfile Configuration](#dockerfile-configuration)

## 🎯 Overview

This project demonstrates advanced Playwright testing patterns including:

- **Page Object Model (POM)** - Organized, maintainable test structure
- **Custom Fixtures** - Reusable page object instances across tests
- **Visual Regression Testing** - Screenshot comparison with custom CSS styling
- **Multi-browser Testing** - Chromium, Firefox, and WebKit support
- **Dockerized Testing** - Consistent test environment across platforms
- **CI/CD Integration** - GitHub Actions workflow with artifact publishing

## 📁 Project Structure

```
playwright_demo/
├── .github/
│   └── workflows/                    # GitHub Actions workflow
├── pages/
├── tests/
│   ├── fixtures.ts                   # Custom test fixtures
│   ├── shared_validation.ts          # Shared validation logic
│   └── visual-comparisons/           # Visual regression tests

```

## ✅ Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Docker** (for containerized testing)
- **Git** for version control

## 🚀 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd playwright_demo
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## 🧪 Running Tests

### Local Execution

**Run all tests:**
```bash
npx playwright test
```

**Run specific test suite:**
```bash
npx playwright test ecommerce_page
```

**Run tests for specific browser:**
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**Run tests in headed mode (watch execution):**
```bash
npx playwright test --headed
```

**View HTML report:**
```bash
npx playwright show-report
```

### Docker Execution

Docker ensures consistent test execution across different environments and matches the CI/CD environment.

**Build the Docker image:**
```bash
docker build -t playwright-demo .
```

**Run tests inside Docker:**
```bash
docker run --rm playwright-demo
```

**Run tests with report export:**
```bash
docker run --rm \
  -v $(pwd)/playwright-report:/app/playwright-report \
  playwright-demo
```

**Update visual snapshots in Docker:**
```bash
docker run --rm \
  -v $(pwd)/tests:/app/tests \
  playwright-demo \
  npx playwright test --update-snapshots
```

**Run specific tests in Docker:**
```bash
docker run --rm playwright-demo npx playwright test ecommerce_page
```

**Interactive debugging in Docker:**
```bash
docker run --rm -it playwright-demo /bin/bash
```

## 📸 Visual Comparison Testing

The project includes visual regression tests that compare screenshots across test runs to detect unintended UI changes.

### Key Features:

- **Cross-browser baselines** - Separate snapshots for each browser engine
- **Custom CSS filtering** - Hides dynamic elements (images) for stable comparisons
- **Responsive testing** - Tests desktop, tablet, and mobile viewports

### Running Visual Tests:

The visual regression tests should be run in Docker to ensure consistency in CI/CD and locally.

**Update baselines in Docker:**
```bash
docker run --rm \
  -v $(pwd)/tests:/app/tests \
  playwright-demo \
  npx playwright test visual-comparisons --update-snapshots
```

**Compare against baselines:**
```bash
npx playwright test visual-comparisons
```

### Important Notes:

- Generate baselines in Docker to match CI environment
- Commit baseline screenshots to version control

## 🔄 GitHub Actions Workflow

The project uses GitHub Actions for automated testing in a Docker environment.

### Workflow: `docker-tests.yml`

**Trigger:** Manual workflow dispatch (does not run automatically on push)

**Steps:**
1. Checks out the repository
2. Builds Docker image from Dockerfile
3. Runs all Playwright tests inside container
4. Uploads HTML test report as GitHub Pages artifact
5. Deploys report to GitHub Pages (if configured)

### Running the Workflow:

**From GitHub Web UI:**
1. Navigate to **Actions** tab in your repository
2. Select **Playwright Tests (Docker)** workflow
3. Click **Run workflow** button
4. Choose the branch
5. Click **Run workflow**

**From GitHub CLI:**
```bash
gh workflow run docker-tests.yml
```

**From specific branch:**
```bash
gh workflow run docker-tests.yml --ref your-branch-name
```

### Viewing Test Reports:

After workflow completes:
1. Go to the **Actions** tab
2. Click on the workflow run
3. Download the `playwright-report` artifact
4. Or view the deployed GitHub Pages site (if configured)

**Report retention:** 30 days

## ⚙️ Test Configuration

Configuration is defined in `playwright.config.ts`:

- **Base URL**: `https://testerbud.com`
- **Browsers**: Chromium, Firefox, WebKit
- **Parallel Execution**: Enabled
- **Retries**: 2 retries on CI, 0 locally
- **Trace**: Captured on first retry
- **Reporter**: HTML report

## 🏗️ Page Object Model

The project follows the Page Object Model pattern for maintainable, reusable test code.

### Base Page (`base.page.ts`)
- Abstract class for all page objects
- Common navigation methods
- URL management

Other pages should extend the base page where appropriate.  

## 🛠️ Dockerfile Configuration

The Dockerfile uses the official Playwright Docker image:

```dockerfile
FROM mcr.microsoft.com/playwright:v1.56.0-jammy
```

- Pre-installed browsers (Chromium, Firefox, WebKit)
- All system dependencies included

---

**Test Site:** [TesterBud](https://testerbud.com/)
