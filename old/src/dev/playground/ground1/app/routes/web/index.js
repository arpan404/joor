export async function route(req) {
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
