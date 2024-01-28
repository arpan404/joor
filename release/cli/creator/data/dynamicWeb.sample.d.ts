declare const dynamicWebSample = "\n{##ImportTypesReqRes##}\n\nexport async function get(req{##RequestType##}){##PromiseResponseType##} {\n  console.log(req);\n  return {\n    body: `\n        <html>\n            <head>\n                <title>User : ${req.param}</title>\n            </head>\n\n            <body>\n            <h1>Hi, ${req.param}</h1>\n            <p>Welcome to the site.</p>\n            </body>\n        </html>\n      `,\n  };\n}\n";
export default dynamicWebSample;