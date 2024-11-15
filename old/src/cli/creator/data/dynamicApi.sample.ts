const dynamicApiSample = `
{##ImportTypesReqRes##}

export async function get(req{##RequestType##}){##PromiseResponseType##}{
  return {
    body: [
      {
        userID: req.param,
        username: "@joor",
        email: "joor@domain.com",
      },
    ],
  };
}
`;
export default dynamicApiSample;
