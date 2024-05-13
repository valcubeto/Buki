import { Context } from "../handleCommand.ts";
import { defaultEmbed, displayJs, displayJson } from "../util.ts";

export function evaluate({ msg, args }: Context) {
  if (msg.author.id !== process.env.OWNER_ID) {
    return
  }

  let errored: boolean;
  let output: any;
  try {
    let code: string = `try { [false, ${args}] } catch (thrown) { [true, thrown instanceof Error ? { err: { name: thrown.name, msg: thrown.message } } : { thrown }] }`;
    [errored, output] = eval(code)
  } catch (thrown) {
    // usually syntax errors
    errored = true
    if (thrown instanceof Error) {
      output = { err: { name: thrown.name, msg: thrown.message } }
    } else {
      output = { thrown }
    }
  }
  const embed = defaultEmbed(msg.author)
  function handle_err(err: any) {
    embed
      .setTitle("Whoops")
      .setDescription(displayJs(err.errors.map((err: any) => ({ ...err, given: "..." }))))
    msg.channel.send({ embeds: [embed,] })
  }
  try {
    embed
      .setTitle(errored ? "Whoops" : "Output")
      .setDescription(displayJs(output));
    msg.channel.send({ embeds: [embed,] }).catch(handle_err)
  } catch(err) {
    handle_err(err)
  }
}
