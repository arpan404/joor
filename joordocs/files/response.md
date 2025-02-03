# Response
To send response, you must return an instance of JoorResponse class from a middleware of a route handler. You must import JoorResponse.

```typescript
import Joor, {JoorResponse} from "joor"
const app = new Joor()

app.get("/joor", async()=>{
    const res = new JoorResponse();
    res.setStatus(200).setData("Hello, world!");
    return res;
})

```

If you want to learn about 