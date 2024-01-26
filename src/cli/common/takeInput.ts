import Marker from "../../app/misc/marker.js";

export default async function takeInput(
  question: string,
  defaultAnswer: string
): Promise<string> {
  process.stdout.write("\x1B[2J\x1B[H");
  console.log(Marker.greenBright(question));

  let answer: string = defaultAnswer;

  process.stdin.setRawMode(true);
  process.stdin.resume();

  return new Promise<string>((resolve) => {
    process.stdin.on("data", function (chunk: Buffer) {
      const input: string = chunk.toString("utf8");

      if (input === "\r") {
        // Enter key
        process.stdout.write("\n");
        process.stdin.pause();
        process.stdin.removeAllListeners("data");
        resolve(answer);
      } else if (input === "\u0003") {
        // Ctrl+C to exit
        process.exit();
      } else {
        answer += input;
        process.stdout.write(input);
      }
    });
  });
}
