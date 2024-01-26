import readline from "readline";
import { OPTION_SELECTOR } from "../../types/cli/index.js";
import Marker from "../../app/misc/marker.js";

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function displayOptions(
  selectedIndex: number,
  question: string,
  options: Array<OPTION_SELECTOR>
): undefined {
  process.stdout.write("\x1B[2J\x1B[H"); // Clear console
  console.log(Marker.greenBright(question));
  options.forEach((option, index) => {
    if (index === selectedIndex) {
      console.log(Marker.blueBright("➤ " + Marker.underline(option.name)));
    } else {
      console.log(Marker.blueBright("  " + option.name));
    }
  });
}
function handleInput(
  key: string,
  currentIndex: number,
  options: Array<OPTION_SELECTOR>
) {
  switch (key) {
    case "up":
      return currentIndex > 0 ? currentIndex - 1 : currentIndex;
    case "down":
      return currentIndex < options.length - 1
        ? currentIndex + 1
        : currentIndex;
    case "return":
      return currentIndex; // Return selected index
    default:
      return currentIndex;
  }
}

function listenForKeypress() {
  return new Promise((resolve) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once("data", (key) => {
      process.stdin.setRawMode(false);
      resolve(key.toString());
    });
  });
}

export default async function optionSelector(
  question: string,
  options: Array<OPTION_SELECTOR>,
  defaultIndex?: number
): Promise<string> {
  let currentIndex = defaultIndex ? defaultIndex : 0;
  displayOptions(currentIndex, question, options);

  while (true) {
    const key = await listenForKeypress();
    if (key === "\u001B[A") {
      // Up arrow key
      currentIndex = handleInput("up", currentIndex, options);
    } else if (key === "\u001B[B") {
      // Down arrow key
      currentIndex = handleInput("down", currentIndex, options);
    } else if (key === "\u000D") {
      // Enter key
      break;
    }
    displayOptions(currentIndex, question, options);
  }
  rl.close();
  return options[currentIndex].value;
}
