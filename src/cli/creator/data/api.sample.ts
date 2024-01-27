const apiSample = `
{##ImportTypesReqRes##}

export async function get(req{##RequestType##}){##PromiseResponseType##}{
  console.log(req);
  return {
    body: [
      {
        userID: "#ty6a",
        username: "@joor",
        email: "joor@domain.com",
      },
      {
        userID: "#ty7a",
        username: "@socioy",
        email: "socioy@domain.com",
      },
    ],
  };
}
`;
export default apiSample;
