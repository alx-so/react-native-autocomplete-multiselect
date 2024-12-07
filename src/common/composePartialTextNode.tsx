import { Text, type TextStyle } from 'react-native';

export const composePartialTextNode = (str: string, opts: PartialTextNodeOpts) => {
  const openTagStart = str.indexOf(opts.startStrPart);
  const openTagEnd = str.indexOf(opts.endStrPart);
  const startStrPart = str.slice(0, openTagStart);
  const midStrPart = str.slice(openTagStart + opts.startStrPart.length, openTagEnd);
  const endStrPart = str.slice(openTagEnd + 4);

  if (openTagStart === -1 || openTagEnd === -1) {
    return <Text>{str}</Text>;
  }

  return (
    <Text>
      {startStrPart}
      <Text style={opts.matchedTextNodeStyle}>{midStrPart}</Text>
      {endStrPart}
    </Text>
  );
};

export const removeTags = (str: string) => {
  return str.replace(/<[^>]*>/g, '');
};

export interface PartialTextNodeOpts {
  startStrPart: string;
  endStrPart: string;
  matchedTextNodeStyle?: TextStyle;
}
