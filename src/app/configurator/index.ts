import path from "path";
import fs from "fs";
import chalk from "chalk"
import joorData from "../../joorData"

export interface JOORCONFIG {
    port: number;
    parseJSON?: boolean
    cors?: boolean
    urlEncoded?: boolean
    allowedURL?: Array<string>
    mode: "development" | "production" | "testing"
    doLogs?: boolean,
    allowsFileUpload?: boolean
}

/**
 * class to deal with configuration part
 * */
export default class Configuration {
    // use protected here so that only child class access these methods and variables

    // name of configuration file which must be "joorData.config.json" and should be located in root directory of the project
    private static configFile: string = "joorData.config.json"

    // variable to hold config data to use in server and is initiated as null.
    private static configData: JOORCONFIG | null = null

    // function to load the config file and store it in configData variable. this function should not be accessed by any other class or function.
    // this function should only be called once and only the parent class without creating any instances
    private async loadConfig(): Promise<void> {
        if (Configuration.configData !== null) {
            console.warn(
                chalk.yellowBright("The configuration data is already loaded. Attempting to load it again is not allowed in this version.")
            )
            console.log(
                "For more information, have a look at : " +
                chalk.greenBright(`${joorData.docs}/configfile`)
            );
            return
        }
        try {
            // getting the absolute path of the config file and storing its data to variable as object of type JOORCONFIG
            const configPath = path.resolve(process.cwd(), Configuration.configFile);
            Configuration.configData = (await JSON.parse(
                fs.readFileSync(configPath, "utf8")
            )) as JOORCONFIG;
            console.log(chalk.greenBright("Configurations have been loaded successfully"))
        } catch (error: any) {
            // catching all the errors and displaying them to the user

            // if file is not found
            if (error.code === "ENOENT") {
                console.error(
                    chalk.redBright(
                        `Error: The configuration file '${Configuration.configFile}' for Joor app is not found.\nMake sure the file is in the root directory of your project.`
                    )
                )
            }
            // if file is not in proper required format
            else if (error instanceof SyntaxError) {
                console.error(
                    chalk.redBright(
                        `Error: The configuration file '${Configuration.configFile}' for Joor app is not in the proper JSON format.\nPlease check the content and ensure it is valid JSON.`
                    )
                )
            } else {
                console.error(chalk.redBright("Error loading config file."), error);
            }
            console.log(
                "For more information, have a look at : " +
                chalk.greenBright(`${joorData.docs}/configfile`)
            )
        }
    }

    // function to return loaded config file. if it fails to load config data, it will throw error, which should cause the server to stop from initiating
    protected async getConfig():Promise<JOORCONFIG>{
        if(Configuration.configData === null){
            await this.loadConfig()
            if(Configuration.configData === null){
                throw new Error("Failed to load configuration file.")
            }
        }
        return Configuration.configData
    }

}
