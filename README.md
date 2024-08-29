<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Description

Welcome to the **Project Cost Management API**, your go-to solution for efficiently managing and controlling all aspects of project costs.

### Key Features

- **Comprehensive Cost Calculation**: Accurately calculate the total cost of projects by separately managing the costs of supplies and professionals. This ensures a clear and detailed breakdown of project expenses.

- **Supplies and Professional Segmentation**: Organize and categorize both supplies and professionals within your projects. By segmenting costs by category, you can easily track and analyze the expenses associated with specific categories, providing more granular insights into your project’s financials.

- **Unit Cost Management**: Define and manage unit costs for both supplies and professionals. This allows for precise cost estimations and adjustments based on the specific resources used in each project.

- **Project-Based Cost Structuring**: Create multiple projects, each with its own set of supply categories and professional categories. This feature supports the simultaneous management of multiple projects, with the ability to track and compare costs across different projects and categories.

- **Category-Specific Cost Tracking**: For each project, track the costs associated with specific categories of supplies and professionals. This functionality provides a deeper understanding of where resources are being allocated and helps identify potential cost-saving opportunities.

- **Real-Time Cost Analysis**: Generate up-to-date reports that reflect the current financial status of your projects. With real-time data, project managers can make informed decisions quickly, ensuring that projects stay within budget.

## Installation and Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (version LTS or later)
- **Node.js** (version 20.6.0 or later)
  - _(optional, for local development and testing)_
- **Git** for cloning the repository

### Cloning the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/DanielRoman11/CostosProyectos.git
cd CostosProyectos
```

### Setup Dev Containers

This project uses DevContainers, a feature provided by Visual Studio Code. You can use your local resources to set up and run the project, but if you want to run this project in a DevContainer, follow these steps:

1. **Install the Remote Development Extension**:

   - To work with DevContainers, you must first install the _Remote Development_ extension in Visual Studio Code. You can find it in the Extensions Marketplace.

2. **Open the Project in VSCode**:

   - Open the project folder in Visual Studio Code.

3. **Rebuild and Reopen in Container**:

   - Press _F1_ to open the Command Palette.
   - Type _"Rebuild and Reopen in Container"_ and select it from the list.
   - Visual Studio Code will then build the DevContainer and open the project inside it.

   _Note: This will set up the development environment as defined in the `.devcontainer` configuration._

4. **Using Local Resources** (Optional):
   - If you prefer to use your local resources instead of DevContainers, you can manually set up and run the project by following the standard installation steps.

By following these steps, you'll have a fully configured development environment ready to go!

### Local Development

> **TIP**
> If you have already set up the DevContainer, you can skip this part.

To set up the project for local development, follow these steps:

#### Install Dependencies:

Install all dependencies used in the project using your preferred package manager:

```bash
# using default npm
$ npm install

# using pnpm
$ pnpm install

# using yarn
$ yarn install
```

> [!NOTE]
> This project was made with pnpm, because of that the rest of the code snippets are using _pnpm_.

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev
```

If you setup everything in your local machine you might have setup a PostgresSQL database, but if you have docker install you can just go and run

```bash
# database service from docker compose file
$ docker compose up db
```

This will run a postgresSQL database service. If you are MAC OS you have to change the HOST on the _.env.dev_ file to this

```bash
DB_HOST=db
```

## Testing

### Running Tests

_Note: The testing setup is still in progress. We are working on integrating test cases and E2E Testing._

Currently, you can run preliminary tests using:

```bash
pnpm test
```

## Database Seeding

To help you get started quickly and understand the structure of the project, you can use the following command:

### Creating Example Data

```bash
pnpm db:seed
```

This will populate your database with sample data, including projects, categories, supplies, and professionals. It’s an easy way to explore the project's features without manually entering data.

Get a Hands-On experience by using the populated data. Don't worry if it's needed you can always delete all data from database by using the following command:

```bash
pnpm db:flush
```

This will delete all the sample data created by the seeding process, allowing you to start fresh.

> [!CAUTION]
> This command will drop every single table in the database. If there is any important data it will be lost forever.

## Stay in touch

- Author - [Daniel Román](https://www.linkedin.com/in/danielroman-/)
- Website - [danielroman.pages.dev](https://danielroman.pages.dev/)
