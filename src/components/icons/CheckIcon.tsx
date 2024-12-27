import { View, StyleSheet, type ViewStyle } from 'react-native';
import { getThemeColors } from '../../styles/theme';

interface CheckIconProps {
  size?: number;
  color?: string;
  containerStyle?: ViewStyle;
}

const theme = getThemeColors();
const defaultSize = 20;
const transformOrigin = {
  x: defaultSize * 0.9,
  y: defaultSize / 6,
};

const CheckIcon = ({
  size = defaultSize,
  color = theme.primary,
  containerStyle = {},
}: CheckIconProps) => (
  <View style={[styles.container, { width: size, height: size }, containerStyle]}>
    <View style={styles.icon}>
      <View style={[styles.line, styles.fullLine, { backgroundColor: color }]} />
      <View style={[styles.line, styles.halfLine, { backgroundColor: color }]} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {},
  icon: {
    width: '100%',
    height: '100%',
    transformOrigin: [transformOrigin.x, transformOrigin.y, 0],
    transform: [{ rotate: '45deg' }],
  },
  line: {
    position: 'absolute',
    height: 2,
    borderRadius: 1,
  },
  fullLine: {
    width: 2,
    height: '90%',
    right: 0,
    bottom: 0,
  },
  halfLine: {
    height: 2,
    width: '45%',
    bottom: 0,
    right: 0,
  },
});

export default CheckIcon;
