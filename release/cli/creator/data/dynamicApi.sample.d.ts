declare const dynamicApiSample = "\n{##ImportTypesReqRes##}\n\nexport async function get(req{##RequestType##}){##PromiseResponseType##}{\n  return {\n    body: [\n      {\n        userID: req.param,\n        username: \"@joor\",\n        email: \"joor@domain.com\",\n      },\n    ],\n  };\n}\n";
export default dynamicApiSample;
