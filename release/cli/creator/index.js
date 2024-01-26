#!/usr/bin/env node
import takeInput from "../common/takeInput.js";
import optionSelector from "../common/optionSelector.js";
import createApp from "./createApp.js";
const languageOptions = [
    {
        name: "JavaScript",
        value: "javascript",
    },
    {
        name: "TypeScript",
        value: "typescript",
    },
];
const databaseOptions = [
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
const creator = async () => {
    const projectName = await takeInput("Name :", "joor-app");
    const projectDescription = await takeInput("Description: ", "A backend web app created and powered by Joor.");
    const language = await optionSelector("Choose language: ", languageOptions, 1);
    const database = await optionSelector("Choose database: ", databaseOptions, 0);
    const version = await takeInput("Version: ", "1.0.0");
    await createApp(projectName, projectDescription, language, database, version);
};
creator();
//# sourceMappingURL=index.js.map