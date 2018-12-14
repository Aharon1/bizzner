import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
class ProgressiveImage extends React.Component {
    imageAnimated = new Animated.Value(0);
    onImageLoad = () => {
        Animated.timing(this.imageAnimated, {
          toValue: 1,
        }).start();
      }
    render() {
      const {
        thumbnailSource,
        source,
        style,
        ...props
      } = this.props;
      return (
        <View style={styles.container}>
          <Animated.Image
            {...props}
            source={source}
            style={[styles.imageOverlay, { opacity: this.imageAnimated }, style]}
            onLoad={this.onImageLoad}
            />
        </View>
      );
    }
  }
const styles = StyleSheet.create({
    imageOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
    },
    container: {
      backgroundColor: '#e1e4e8',
    },
  });
export default ProgressiveImage;