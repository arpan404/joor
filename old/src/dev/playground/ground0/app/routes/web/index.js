export async function route(req) {
  const r = Math.random();
  return {
    body: `<html>
<head>
  <title>Title of the document</title>
</head>
<body>
${r}
  <h1>This is a heading</h1>
  <p>This is a paragraph.</p>
  aaaas
</body>
</html>`,
  };
}
