const dynamicWebSample = `
{##ImportTypesReqRes##}

export async function get(req{##RequestType##}){##PromiseResponseType##} {
  console.log(req);
  return {
    body: \`
        <html>
            <head>
                <title>User : \${req.param}</title>
            </head>

            <body>
            <h1>Hi, \${req.param}</h1>
            <p>Welcome to the site.</p>
            </body>
        </html>
      \`,
  };
}
`;
export default dynamicWebSample;
//# sourceMappingURL=dynamicWeb.sample.js.map