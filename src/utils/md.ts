const md = {
  pre: (str: TemplateStringsArray | string) => `\`\`\`${str}\`\`\``,
  code: (str: TemplateStringsArray | string) => `\`${str}\``,
  bold: (str: TemplateStringsArray | string) => `*${str}*`,
  italic: (str: TemplateStringsArray | string) => `_${str}_`,
  list: (
    arr: string[],
    { map = (x: string) => x, bullet = '🔸' } = {},
  ): string => arr.map(item => map(`${bullet} ${item}`)).join('\n'),
};

export default md;
