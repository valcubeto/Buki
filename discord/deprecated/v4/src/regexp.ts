export function escapeExp(exp: string): string {
  return exp.replace(/[\+\/\\\^\$\*\+\?\.\(\)\|\[\]\{\}]/g, "\\$&");
}
