export default async function createApp(
  projectName: string,
  projectDescription: string,
  language: string,
  database: string,
  version: string,
  author:string
) {
  console.log(projectDescription, projectName, language, database, version, author);
}
