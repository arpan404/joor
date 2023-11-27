// import express, { Express } from "express";
// import { Request, Response } from "types/joor.js";
// import cors from "cors";
// import chalk from "chalk";
// import fs, { Dirent } from "fs";
// import { JOORCONFIG } from "types/joorconfig.interface.js";
// import { DYNAMIC_DATA } from "types/server.js";
// export class Server {
//   private config: JOORCONFIG | null = null;
//   constructor(configData: JOORCONFIG | null) {
//     this.config = configData;
//   }
//   public async listen() {
//     try {
//       await this.startListening();
//     } catch (error: any) {
//       if (this.config?.doLogs) {
//         if (error.code === "EADDRINUSE") {
//           console.log(
//             chalk.redBright(`Port ${this.config?.port} is already in use.`)
//           );
//           process.exit(1);
//         } else {
//           console.log(
//             chalk.redBright(`An error occurred while starting the server : `) +
//               "\n" +
//               error
//           );
//         }
//         process.exit(1);
//       }
//     }
//     console.log(chalk.green("\n\nJoor app has been started."));
//     console.log(
//       chalk.white.bgGreen.bold(
//         "Started at : http://localhost:" + this.config?.port
//       )
//     );
//   }

//   private async startListening() {
//     const app: Express = express();
//     const rootFolder = "/app/routes/";
//     if (this.config?.parseJson) {
//       app.use(express.json());
//     }
//     if (this.config?.cors) {
//       app.use(cors());
//     }
//     app.all("/*", async (req: Request, res: Response) => {
//       let folder = process.cwd() + rootFolder + req.url;
//       const fileExtension = this.config?.language === "js" ? ".js" : ".ts";
//       const file = folder + "/index" + fileExtension;
//       let result = await this.handleRegularRoute(req, res, file, fileExtension);
//       if (result === false) {
//         const dynamicData: DYNAMIC_DATA = await this.handleDynamicRoute(
//           folder,
//           fileExtension
//         );
//         if (typeof dynamicData === "boolean") {
//           return res.status(400).send("Route not found");
//         }
//         req.params = {
//           ...req.params,
//           [dynamicData.baseRoute]: dynamicData.param,
//         };
//         const dynamicResult = await this.handleRegularRoute(
//           req,
//           res,
//           dynamicData.file,
//           fileExtension
//         );
//         if (!dynamicResult) {
//           return res.status(400).send("Route not found");
//         }
//         return res.send(dynamicResult);
//       } else {
//         return res.send(result);
//       }
//     });
//     app.listen(this.config?.port);
//   }
//   private async handleRegularRoute(
//     req: Request,
//     res: Response,
//     file: string,
//     fileExtension: string
//   ): Promise<any> {
//     try {
//       file = file.replace("//", "/").replace("..", ".");
//       const module = await import(file);
//       let data: any = null;
//       let httpMethod: string = req.method;
//       httpMethod = module[httpMethod] ? httpMethod : httpMethod.toLowerCase();
//       httpMethod = module[httpMethod]
//         ? httpMethod
//         : httpMethod.charAt(0).toUpperCase() + httpMethod.slice(1);
//       const middleware: any = await this.handleMiddleWare(
//         req,
//         res,
//         file,
//         fileExtension,
//         httpMethod
//       );
//       if (middleware !== undefined) {
//         return middleware;
//       }
//       if (module[httpMethod]) {
//         data = module[httpMethod](req, res);
//       } else {
//         data = module.route(req, res);
//       }
//       return data;
//     } catch (error) {
//       if (this.config?.doLogs) {
//         console.log(chalk.redBright(error));
//       }
//       res.statusCode = 404;
//       return false;
//     }
//   }
//   private async handleDynamicRoute(
//     folder: string,
//     fileExtension: string
//   ): Promise<DYNAMIC_DATA> {
//     try {
//       const pathArray: Array<string> = folder.split("/");
//       const urlParamElement: string = pathArray.pop()!;
//       const urlFolderElement: string = pathArray.pop()!;
//       const foldersAvailable: boolean = await this.checkDynamicRoute(
//         pathArray.join("/"),
//         urlFolderElement
//       );
//       if (!foldersAvailable) {
//         return false;
//       }
//       const fileURL = `${pathArray.join(
//         "/"
//       )}/[${urlFolderElement}]/index${fileExtension}`;
//       const dynamicData: DYNAMIC_DATA = {
//         param: urlParamElement,
//         baseRoute: urlFolderElement,
//         file: fileURL,
//       };
//       return dynamicData;
//     } catch (error) {
//       if (this.config?.doLogs) {
//         console.log(chalk.redBright(error));
//       }
//       return false;
//     }
//   }
//   private async checkDynamicRoute(
//     baseFolder: string,
//     urlFolderElement: string
//   ): Promise<boolean> {
//     try {
//       let result;
//       const directories = await fs.promises.readdir(baseFolder, {
//         withFileTypes: true,
//       });
//       const subDirectory: Dirent[] = directories.filter((sub) => {
//         return sub.isDirectory() && sub.name === `[${urlFolderElement}]`;
//       });
//       if (subDirectory.length > 0) {
//         result = true;
//       } else {
//         result = false;
//       }
//       return result;
//     } catch (error) {
//       if (this.config?.doLogs) {
//         console.log(chalk.redBright(error));
//       }
//       return false;
//     }
//   }
//   private async handleMiddleWare(
//     req: Request,
//     res: Response,
//     file: string,
//     fileExtension: string,
//     httpMethod: string
//   ) {
//     const pathArray: Array<string> = file.split("/");
//     pathArray.pop();
//     const middlewareFile: string = (
//       pathArray.join("/") +
//       "/middleware" +
//       fileExtension
//     ).replace("//", "/");
//     try {
//       await fs.promises.access(middlewareFile);
//       try {
//         const middleware = await import(middlewareFile);
//         let data: any = undefined;
//         if (middleware[httpMethod]) {
//           data = middleware[httpMethod](req, res);
//         } else {
//           data = middleware.route(req, res);
//         }
//         return data;
//       } catch (error) {
//         if (this.config?.doLogs) {
//           chalk.redBright(console.log(error));
//         }
//         res.statusCode = 500;
//         if (this.config?.mode === "dev") {
//           return "<b>Failed to load middleware function<br>Make sure middleware function is in right format.<br>For more info check logs.<b>";
//         }
//         return "Internal Server Error";
//       }
//     } catch (error) {
//       return undefined;
//     }
//   }
// }