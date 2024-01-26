#!/usr/bin/env node
import { OPTION_SELECTOR } from "../../types/cli/optionSelector.js";
import takeInput from "../common/takeInput.js";
import optionSelector from "../common/optionSelector.js";
import createApp from "./createApp.js";

const languageOptions: Array<OPTION_SELECTOR> = [
  {
    name: "JavaScript",
    value: "javascript",
  },
  {
    name: "TypeScript",
    value: "typescript",
  },
];
const databaseOptions: Array<OPTION_SELECTOR> = [
  {
    name: "MongoDB",
    value: "mongodb",
  },
  {
    name: "PostreSQL",
    value: "postresql",
  },
  {
    name: "mysql",
    value: "mysql",
  },
];
const creator = async (): Promise<void> => {
  const projectName = await takeInput("Name :", "joor-app");
  const projectDescription = await takeInput(
    "Description: ",
    "A backend web app created and powered by Joor."
  );
  const language = await optionSelector(
    "Choose language: ",
    languageOptions,
    1
  );
  const database = await optionSelector(
    "Choose database: ",
    databaseOptions,
    0
  );
  const version = await takeInput("Version: ", "1.0.0");
  await createApp(projectName, projectDescription, language, database, version);
};
creator();
