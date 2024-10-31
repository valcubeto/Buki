import { Context } from "../handleCommand.ts";
import { defaultEmbed, displayJs } from "../util.ts";

export function evaluate({ msg, content }: Context) {
  if (msg.author.id !== process.env.OWNER_ID) {
    return;
  }

  let errored: boolean;
  let output: any;
  try {
    let code: string = `try { [false, ${content}] } catch (thrown) { [true, thrown instanceof Error ? thrown : { thrown }] }`;
    [errored, output] = eval(code)
  } catch (thrown) {
    // usually syntax errors
    errored = true
    output = thrown instanceof Error ? thrown : { thrown }
  }
  let embed = defaultEmbed(msg.author);
  function handleError(err: any) {
    embed
      .setTitle("Whoops")
      .setDescription(displayJs(err));
    msg.channel.send({ embeds: [embed,] })
      .catch((err: any) => console.error(err))
  }
  try {
    embed
      .setTitle(errored ? "Whoops" : "Output")
      .setDescription(displayJs(output));
    msg.channel.send({ embeds: [embed,] }).catch(handleError)
  } catch(err) {
    handleError(err)
  }
}
