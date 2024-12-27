import { type ViewStyle } from 'react-native';

interface ThemeColors {
  primary: string;
  secondary: string;
  secondaryDark: string;
  white: string;
  dark: string;
}

type ThemeType = 'light' | 'dark';
type ThemeElements =
  | 'input'
  | 'inputOuterContainer'
  | 'inputContainer'
  | 'inputFocused'
  | 'select'
  | 'selectFocused'
  | 'dropdown'
  | 'dropdownScrollView'
  | 'dropdownItem'
  | 'dropdownItemSelected';

const colors: Record<ThemeType, ThemeColors> = {
  light: {
    primary: 'rgb(136, 103, 236)',
    secondary: 'rgb(243, 244, 246)',
    secondaryDark: 'rgb(200, 200, 200)',
    white: 'rgb(255, 255, 255)',
    dark: 'rgb(0, 0, 0)',
  },
  dark: {
    primary: 'rgb(100, 69, 165)',
    secondary: 'rgb(231, 231, 231)',
    secondaryDark: 'rgb(200, 200, 200)',
    white: 'rgb(255, 255, 255)',
    dark: 'rgb(0, 0, 0)',
  },
};

const baseStyleConstants = {
  borderWidth: 2,
  borderRadius: 8,
  elevation: 5,
};

const baseStyle = {
  input: {
    borderWidth: baseStyleConstants.borderWidth,
    borderRadius: baseStyleConstants.borderRadius,
  },
  select: {
    borderWidth: baseStyleConstants.borderWidth,
    borderRadius: baseStyleConstants.borderRadius,
  },
};

const composeThemeElementsStyle = (theme: ThemeType) => {
  const _colors = colors[theme];

  const styles: Record<ThemeElements, ViewStyle> = {
    inputOuterContainer: {
      ...baseStyle.input,
      backgroundColor: _colors.white,
      borderColor: _colors.secondary,
    },
    inputContainer: {},
    input: {
      paddingHorizontal: 12,
    },
    inputFocused: {
      borderColor: _colors.primary,
    },
    select: {
      ...baseStyle.select,
      backgroundColor: _colors.white,
      borderColor: _colors.secondary,
    },
    selectFocused: {
      borderColor: _colors.primary,
    },
    dropdownScrollView: {
      borderRadius: baseStyleConstants.borderRadius,
    },
    dropdown: {
      backgroundColor: _colors.white,
      borderRadius: baseStyleConstants.borderRadius,
      borderWidth: baseStyleConstants.borderWidth / 2,
      borderColor: _colors.secondaryDark,
      elevation: baseStyleConstants.elevation,
    },
    dropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: _colors.white,
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    dropdownItemSelected: {
      backgroundColor: _colors.secondary,
    },
  };

  return styles;
};

export const getThemeStyles = (theme: ThemeType = 'light') => composeThemeElementsStyle(theme);
export const getThemeColors = (theme: ThemeType = 'light') => colors[theme];
