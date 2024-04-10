/**
 * Parse numeric range such as '1-4','1,2', etc.
 */
export const numericRangeParser = (input: string): number[] => {
  let output: number[] = [];
  let matched: RegExpMatchArray | null;

  const inputArr = input.split(',').map(i => i.trim());

  const dashNumberStr = '-?\\d+';

  const dashNumberRegex = new RegExp(`^${dashNumberStr}$`);
  const dotNumberRegex = new RegExp(
    '^' +
    '(' + dashNumberStr + ')' +
    '(' + '-|\\.\\.\\.?|\\u2025|\\u2026|\\u22EF' + ')' +
    '(' + dashNumberStr + ')' +
    '$'
  );

  inputArr.forEach(str => {
    if (dashNumberRegex.test(str)) {
      output.push(parseInt(str, 10));
    } else if ((matched = str.match(dotNumberRegex))) {
      let lt: string | number;
      let rt: string | number;
      let sep: string;
      [, lt, sep, rt] = matched;
      if (!lt || !rt) return;
      lt = parseInt(lt, 10);
      rt = parseInt(rt, 10);
      const incr = lt < rt ? 1 : -1;

      if (sep === '-' || sep === '..' || sep === '\u2025') rt += incr;

      for (let i = lt; i !== rt; i += incr) {
        output.push(i);
      }
    }
  });

  return output;
};
