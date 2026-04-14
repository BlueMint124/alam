import { renderToStaticMarkup } from "react-dom/server";
import { App } from "../src/app/App.tsx";

const html = renderToStaticMarkup(App());

if (!html.includes("<h1>ArriveHae</h1>")) {
  throw new Error(`Expected shell heading to render, got: ${html}`);
}

console.log("Smoke test passed");
