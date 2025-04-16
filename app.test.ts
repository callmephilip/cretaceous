import { assert } from "jsr:@std/assert";
import { app } from "hellojurassic/app.ts";

Deno.test("app", () => {
  assert(app);
});
