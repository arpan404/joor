import path from "path";
import fs from "fs";
import Marker from "../misc/marker.js";
import joor from "../../data.js";
// Class to handle loading of config file
export class Config {
    //Name of configFile must be joor.config.json and should be located in root directory of project
    static configFile = "joor.config.json";
    // Predefining configData as null so that it can be initialized later
    static configData = null;
    // This function will load the config file and store it in configData
    // This function should not be accessed by public class or functions
    static async load() {
        try {
            // Getting absoulte path of the config file and storing its data to variable as object of type JOORCONFIG
            const configPath = path.resolve(process.cwd(), this.configFile);
            this.configData = (await JSON.parse(fs.readFileSync(configPath, "utf8")));
        }
        catch (error) {
            // Catching all the errors and displaying them to the user
            // if not file not found
            if (error.code === "ENOENT") {
                console.error(Marker.red(`Error: The configuration file '${this.configFile}' for joor app is not found.\nMake sure the file is in the root directory of your project.`));
            }
            // if file is not in proper required format
            else if (error instanceof SyntaxError) {
                console.error(Marker.red(`Error: The configuration file '${this.configFile}' for joor app is not in the proper JSON format.\nPlease check the content and ensure it is valid JSON.`));
            }
            else {
                console.error(Marker.red("Error loading config file."), error);
            }
            console.log("For more information, have a look at : " +
                Marker.green(`${joor.docs}/configfile`));
        }
    }
    // This function can be accessed by public class or functions, and loads (only if not loaded before), and returns config data from joor.config.json file
    static async get() {
        if (this.configData === null) {
            await this.load();
        }
        return this.configData;
    }
}
//# sourceMappingURL=loadConfig.js.map