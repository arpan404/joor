#!/usr/bin/env node
import createApp from "./createApp.js";
import inquirer from "inquirer";

const creator = async (): Promise<void> => {
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is your project-name? ",
      default: "joor-app",
    },
    {
      type: "input",
      name: "description",
      message: "Enter project's description : ",
      default: "A backend web app created and powered by Joor.",
    },

    {
      type: "list",
      name: "language",
      message: "Choose language:",
      choices: [
        {
          name: "JavaScript",
          value: "javascript",
        },
        {
          name: "TypeScript",
          value: "typescript",
        },
      ],
      default: "typescript",
    },
    {
      type: "list",
      name: "database",
      message: "Choose database:",
      choices: [
        {
          name: "MongoDB",
          value: "mongodb",
        },
        {
          name: "PostgreSQL",
          value: "postgresql",
        },
        {
          name: "MySQL",
          value: "mysql",
        },
      ],
      default: "mongodb",
    },
    {
      type: "input",
      name: "version",
      message: "Version : ",
      default: "1.0.0",
    },
    {
      type: "input",
      name: "author",
      message: "Author's Name: ",
      default: "Socioy",
    },
  ]);
  createApp(
    answer.name,
    answer.description,
    answer.language,
    answer.database,
    answer.version,
    answer.author
  );
};
creator();
