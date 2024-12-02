import { View, StyleSheet, Pressable, type StyleProp, type ViewStyle } from 'react-native';

const defaultSize = 16;

const CrossIcon: CrossIconComponent = (props) => {
  const size = props.size || defaultProps.size;
  const sizeStyle = { width: size, height: size };

  return (
    <Pressable
      disabled={props.disabled}
      style={[styles.cross, sizeStyle, props.styles]}
      onPress={props.onPress}
    >
      <View style={[styles.line, styles.line1]} />
      <View style={[styles.line, styles.line2]} />
    </Pressable>
  );
};

interface CrossIconProps {
  disabled?: boolean;
  styles?: StyleProp<ViewStyle>;
  size?: number;
  onPress?: () => void;
}

type CrossIconComponent = React.FC<CrossIconProps>;

const defaultProps: CrossIconProps = {
  size: defaultSize,
};

const styles = StyleSheet.create({
  cross: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#444',
  },
  line1: {
    transform: [{ rotate: '45deg' }],
  },
  line2: {
    transform: [{ rotate: '-45deg' }],
  },
});

export default CrossIcon;
