import React from 'react';
import { Keyboard, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import { Position, type ContainerRect } from '../../types/common';

type DropdownPosition = Position.Top | Position.Bottom;

const keyboardDefaultDimensions = { height: 0, width: 0 };

export const useContainerStyle = (rect: ContainerRect, maxDropdownHeight: number) => {
  const { deviceDimensions, keyboardDimensions } = useNativeElementsInfo();
  const position = calcDropdownPosition(rect, {
    maxDropdownHeight,
    windowHeight: deviceDimensions.height,
    keyboardHeight: keyboardDimensions.height,
  });

  const containerStyle = getContainerStylePosition(position, rect.height);

  return containerStyle;
};

const useNativeElementsInfo = () => {
  const [keyboardDimensions, setKeyboardDimensions] = React.useState(keyboardDefaultDimensions);
  const deviceDimensions = useWindowDimensions();

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardDimensions({
        height: event.endCoordinates.height,
        width: event.endCoordinates.width,
      });
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardDimensions(keyboardDefaultDimensions);
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
  rect: ContainerRect,
  opts: {
    maxDropdownHeight: number;
    windowHeight: number;
    keyboardHeight: number;
  }
) => {
  const yPos = rect.pageY + rect.height;
  const windowHeightWithoutKeyboard = opts.windowHeight - opts.keyboardHeight;
  const spaceAvaiableAfterEl = windowHeightWithoutKeyboard - yPos;

  if (spaceAvaiableAfterEl < opts.maxDropdownHeight) {
    return Position.Top;
  }

  return Position.Bottom;
};
