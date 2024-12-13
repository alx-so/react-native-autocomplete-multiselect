import React from 'react';
import {
  Keyboard,
  useWindowDimensions,
  type LayoutRectangle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Position } from '../../types/common';

type DropdownPosition = Position.Top | Position.Bottom;

const keyboradDefaultDimensions = { height: 0, width: 0 };

export const useContainerStyle = (rect: LayoutRectangle, dropdownHeight: number) => {
  const { deviceDimensions, keyboardDimensions } = useNativeElementsInfo();
  const position = calcDropdownPosition(rect, {
    dropdownHeight,
    windowHeight: deviceDimensions.height,
    keyboardHeight: keyboardDimensions.height,
  });

  const containerStyle = getContainerStylePosition(position, rect.height);

  return containerStyle;
};

const useNativeElementsInfo = () => {
  const [keyboardDimensions, setKeyboardDimensions] = React.useState(keyboradDefaultDimensions);
  const deviceDimensions = useWindowDimensions();

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardDimensions({
        height: event.endCoordinates.height,
        width: event.endCoordinates.width,
      });
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardDimensions(keyboradDefaultDimensions);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return { deviceDimensions, keyboardDimensions };
};

const getContainerStylePosition = (
  pos: DropdownPosition,
  containerHeight: number
): StyleProp<ViewStyle> => {
  return {
    top: pos === 'top' ? 'auto' : containerHeight,
    bottom: pos === 'top' ? containerHeight : 'auto',
  };
};

const calcDropdownPosition = (
  rect: LayoutRectangle,
  opts: {
    dropdownHeight: number;
    windowHeight: number;
    keyboardHeight: number;
  }
) => {
  const yBottomPosition = rect.y + rect.height;
  const yBottomPositionWithDropdown = yBottomPosition + opts.dropdownHeight;
  const windowHeightWithoutKeyboard = opts.windowHeight - opts.keyboardHeight;

  if (yBottomPositionWithDropdown > windowHeightWithoutKeyboard) {
    return Position.Top;
  }

  return Position.Bottom;
};
