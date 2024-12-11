import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import type { PositionType } from '../types/common';

const defaultSize = 16;

const ChevronIcon: ChevronIconComponent = (props) => {
  const size = props.size || (defaultProps.size as number);
  const containerStyle = { width: size * 1.75, height: size * 1.5 };
  const chevronStyle = {
    width: size,
    height: size,
    transform: [
      {
        rotate: getRotationDegree(props.rotation || 'Bottom'),
      },
    ],
  };

  return (
    <Pressable
      disabled={props.disabled}
      style={[styles.chevron, containerStyle, props.style]}
      onPress={props.onPress}
    >
      <View style={[styles.icon, chevronStyle]} />
    </Pressable>
  );
};

interface ChevronIconProps {
  /**
   * @default 'bottom'
   */
  rotation?: PositionType;
  disabled?: boolean;
  size?: number;
  style?: ViewStyle;
  onPress?: () => void;
}

type ChevronIconComponent = React.FC<ChevronIconProps>;

const defaultProps: ChevronIconProps = {
  size: defaultSize,
};

const iconTransformOrigin = defaultSize / 2;

const styles = StyleSheet.create({
  chevron: {
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    transformOrigin: [iconTransformOrigin, iconTransformOrigin, 0],
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#444',
  },
});

function getRotationDegree(rotation: PositionType) {
  switch (rotation) {
    case 'Top':
      return '-135deg';
    case 'Left':
      return '135deg';
    case 'Right':
      return '-45deg';
  }

  return '45deg';
}

export default ChevronIcon;
