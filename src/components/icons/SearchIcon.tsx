import React from 'react';
import { View, StyleSheet } from 'react-native';

const defaultSize = 20;
const borderWidth = 2;

const SearchIcon: React.FC = () => {
  const sizeStyle = { width: defaultSize, height: defaultSize };

  return (
    <View style={[styles.container, sizeStyle]}>
      <View style={styles.circle} />
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circle: {
    width: '65%',
    height: '65%',
    borderRadius: 100,
    borderWidth: borderWidth,
    borderColor: '#444',
  },
  line: {
    width: '40%',
    height: borderWidth,
    backgroundColor: '#444',
    position: 'absolute',
    right: 0,
    bottom: 0,
    transformOrigin: 'right bottom',
    transform: [{ rotate: '45deg' }],
  },
});

export default SearchIcon;
