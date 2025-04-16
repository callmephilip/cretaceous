import { Hono } from "hono";
import { app as mainApp } from "hellojurassic/app.ts";

const app = new Hono();

export const routes = app.get("/api/clock", (c) => {
  return c.json({
    time: new Date().toLocaleTimeString(),
  });
});

const getEnv = (key: string) => {
  // get env between Vite (dev server) and Deno (prod server)
  if (typeof Deno === "object") {
    return Deno.env.get(key);
  } else {
    return import.meta.env.PROD;
  }
};

const getProdAssets = () => {
  return ["static", "assets"].map((d) => {
    const dir = Deno.readDirSync(`./dist/${d}`);
    return Array.from(dir).map((f) => {
      if (f.isFile && f.name.endsWith(".js")) {
        return <script key={f.name} type="module" src={`/${d}/${f.name}`} />;
      } else if (f.isFile && f.name.endsWith(".css")) {
        return <link key={f.name} rel="stylesheet" href={`/${d}/${f.name}`} />;
      }
    }).filter((f) => f);
  }).reduce((acc, dir) => {
    return [...acc, ...dir];
  }, []);
};

app.get("/", (c) => {
  console.log("get /", mainApp());
  return c.html(
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        {getEnv("PROD")
          ? getProdAssets()
          : <script type="module" src="/client/index.tsx" />}
      </head>
      <body>
        <div id="root" />
      </body>
    </html>,
  );
});

export default app;
export type AppType = typeof routes;
