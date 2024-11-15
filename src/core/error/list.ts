import joorData from "../../data/joor";
import { JOOR_ERROR_LIST } from "./type";

/**
 * Contains all the error's data which can be retrived using errorCode
 */
const errorList: JOOR_ERROR_LIST = {
  "config-w1": {
    message:
      "The configuration data is already loaded. Attempting to load it again is not allowed in this version.",
    type: "warn",
  },
  "config-p1": {
    message: `Error: The configuration file '${joorData.configFile}' for Joor app is not found.\nMake sure the file is in the root directory of your project.`,
    type: "panic",
  },
  "config-p2": {
    message: `Error: The configuration file '${joorData.configFile}' for Joor app is not in the proper JSON format.\nPlease check the content and ensure it is valid JSON.`,
    type: "panic",
  },
  "config-p3": {
    message: `Error occured while loading the configuration file.`,
    type: "panic",
  },
};
export default errorList;
