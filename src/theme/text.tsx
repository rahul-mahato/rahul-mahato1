import { Text as RNText, type TextProps, type TextStyle, StyleSheet } from 'react-native';
import { colors, fonts } from './tokens';

type Variant =
  | 'displayLg'
  | 'display'
  | 'title'
  | 'body'
  | 'bodyDim'
  | 'meta'
  | 'mono'
  | 'serifBody'
  | 'serifItalic'
  | 'serifQuote';

interface Props extends TextProps {
  variant?: Variant;
  italic?: boolean;
  style?: TextStyle | TextStyle[];
}

export function Text({ variant = 'body', italic, style, ...rest }: Props) {
  return <RNText {...rest} style={[styles[variant], italic && styles.italic, style as TextStyle]} />;
}

const styles = StyleSheet.create({
  displayLg: {
    fontFamily: fonts.serif,
    fontSize: 38,
    lineHeight: 44,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  display: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 34,
    color: colors.ink,
  },
  title: {
    fontFamily: fonts.serifMd,
    fontSize: 18,
    lineHeight: 24,
    color: colors.ink,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink,
  },
  bodyDim: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkDim,
  },
  meta: {
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 16,
    color: colors.inkFaint,
  },
  mono: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.glow,
    letterSpacing: 1.6,
  },
  serifBody: {
    fontFamily: fonts.serif,
    fontSize: 17,
    lineHeight: 24,
    color: colors.ink,
  },
  serifItalic: {
    fontFamily: fonts.serifItalic,
    fontSize: 22,
    lineHeight: 30,
    color: colors.ink,
  },
  serifQuote: {
    fontFamily: fonts.serifItalic,
    fontSize: 14,
    lineHeight: 22,
    color: colors.inkDim,
  },
  italic: {
    fontFamily: fonts.serifItalic,
    color: colors.accent,
  },
});
