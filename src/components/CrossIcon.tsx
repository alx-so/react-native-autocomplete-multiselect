import { View, StyleSheet } from 'react-native';

const defaultSize = 40;

const CrossIcon: CrossIconType = (props) => {
  const size = props.size || defaultProps.size;
  const sizeStyle = { width: size, height: size };

  return (
    <View style={[styles.cross, sizeStyle]}>
      <View style={[styles.line, styles.line1]} />
      <View style={[styles.line, styles.line2]} />
    </View>
  );
};

interface CrossIconProps {
  size?: number;
}

type CrossIconType = React.FC<CrossIconProps>;

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
