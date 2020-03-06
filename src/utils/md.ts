export const pre = (str: TemplateStringsArray | string) => `\`\`\`${str}\`\`\``;
export const code = (str: TemplateStringsArray | string) => `\`${str}\``;
export const bold = (str: TemplateStringsArray | string) => `*${str}*`;
export const italic = (str: TemplateStringsArray | string) => `_${str}_`;
export const list = (arr: string[], { map = (x: string) => x, bullet = '🔹' } = {}): string =>
  arr.map(item => map(`${bullet} ${item}`)).join('\n');
