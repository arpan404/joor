const apiSample = `
{##ImportTypesReqRes##}

export async function get(req{##RequestType##}){##PromiseResponseType##}{
  return {
    body: [
      {
        method: req.method,
        username: "@joor",
        email: "joor@domain.com",
      },
    ],
  };
}
`;
export default apiSample;
//# sourceMappingURL=api.sample.js.map