import { escapeExp } from "./regexp.ts";
import { bold, green, cyan, yellow } from "./debug.ts";

const stringToEscape = ".hello $name";

function test(testName: string, expr: string, value: any) {
  console.log(bold(`Testing ${green(`"${testName}"`)} `));
  console.log(`  ${cyan(expr)} = ${yellow(`"${value}"`)}`);
  console.log();
}

test(
  "escapeExp",
  `escapeExp("${stringToEscape}")`,
  escapeExp(stringToEscape)
)
