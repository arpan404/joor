import { REQUEST, RESPONSE } from "joor";

export async function route(req: REQUEST): Promise<RESPONSE> {
  return {
    body: `<html>
<head>
  <title>Title of the document</title>
</head>

<body>
  <h1>This is a heading</h1>
  <p>This is a paragraph.</p>
</body>
</html>`,
  };
}
