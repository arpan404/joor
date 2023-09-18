async function handleRequests(request: Request): Promise<Response> {
  const url: URL = new URL(request.url);
  const pathName: string = url.pathname.slice(1);
  console.log(pathName.split("/"));
  const isApi: boolean = pathName.split("/")[0] === "api";
  const rootFolder = "/app/routes/" + (isApi ? "api" : "web") + "/";
  console.log(pathName);
  let folder = (process.cwd() + rootFolder + pathName).replace("//", "/");
  console.log(folder);
  return new Response("Hello");
}
export default handleRequests;
