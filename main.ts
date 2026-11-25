// The Moon Finally Answers Back — entry for @syukuran.
// Writes one original moon comeback (see ENTRY.text) to /output/entry.txt.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY = {
  text: "Four billion years of wishes, howls, and 3 a.m. promises \u2014 and nobody has ever once wished me good night back.",
  maxChars: 240,
};

function checkLine(line: string): string | null {
  if (line.length < 1) return "empty";
  if (line.length > ENTRY.maxChars) {
    return `too long: ${line.length} chars (max ${ENTRY.maxChars})`;
  }
  if (/[\r\n]/.test(line)) return "must be a single line";
  if (line.trim().length === 0) return "blank";
  if (Buffer.from(line, "utf8").toString("utf8") !== line) {
    return "not valid UTF-8";
  }
  return null;
}

const problem = checkLine(ENTRY.text);
if (problem) {
  console.error(`gate fail: ${problem}`);
  process.exit(1);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", ENTRY.text, "utf8");

// Read-back verification: the file on disk must be byte-identical to the
// gated text, so a partial write or stray content can never pass silently.
const onDisk = readFileSync("/output/entry.txt", "utf8");
if (onDisk !== ENTRY.text) {
  console.error("read-back fail: /output/entry.txt does not match the gated entry");
  process.exit(1);
}
const diskProblem = checkLine(onDisk);
if (diskProblem) {
  console.error(`read-back gate fail: ${diskProblem}`);
  process.exit(1);
}
console.log(`wrote ${ENTRY.text.length} chars to /output/entry.txt (read-back verified)`);
