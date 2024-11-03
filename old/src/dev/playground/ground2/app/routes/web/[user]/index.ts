import { REQUEST, RESPONSE } from "joorData";

export async function get(req: REQUEST): Promise<RESPONSE> {
  console.log(req);
  return {
    body: `
      <html>
<head>
  <title>User : ${req.param}</title>
</head>

<body>
  <h1>Hi, ${req.param}</h1>
  <p>Welcome to the site.</p>
</body>
</html>
      `,
  };
}
