import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const target = resolve(process.argv[2] || "app/index.html");
const root = resolve(target, "..");
const html = readFileSync(target, "utf8");
const failures = [];

if (!/^\s*<!doctype html>/i.test(html)) {
  failures.push("missing <!doctype html> at the top of the file");
}

if (html.includes("```")) {
  failures.push("contains Markdown code fences");
}

for (const required of ["id=\"stepList\"", "id=\"wizardView\"", "id=\"generatedPrompt\"", "app.js", "styles.css", "</html>"]) {
  if (!html.includes(required)) failures.push(`missing required marker: ${required}`);
}

const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
const scriptSources = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);

if (scripts.length === 0 && scriptSources.length === 0) {
  failures.push("no script found");
}

scripts.forEach((script, index) => {
  try {
    new Function(script);
  } catch (error) {
    failures.push(`script ${index + 1} has a syntax error: ${error.message}`);
  }
});

scriptSources.forEach((source) => {
  if (/^https?:\/\//i.test(source)) return;
  const scriptPath = resolve(root, source);
  if (!existsSync(scriptPath)) {
    failures.push(`script source does not exist: ${source}`);
    return;
  }
  const result = spawnSync(process.execPath, ["--check", scriptPath], {
    encoding: "utf8"
  });
  if (result.status !== 0) {
    failures.push(`script source has a syntax error: ${source}\n${result.stderr || result.stdout}`);
  }
});

if (failures.length > 0) {
  console.error(`Static app validation failed for ${target}:`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Static app validation passed for ${target}`);
