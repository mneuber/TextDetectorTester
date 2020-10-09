/* eslint-disable no-console */
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Slider} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import {RNCamera} from 'react-native-camera-standalone-mlkit';

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

const landmarkSize = 2;

export default class CameraScreen extends React.Component {
  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    depth: 0,
    type: 'back',
    whiteBalance: 'auto',
    canDetectText: true,
    textColorIndex: 0,
    ratio: '16:9',
    recordOptions: {
      mute: true,
      maxDuration: 5,
      quality: RNCamera.Constants.VideoQuality['288p'],
    },
    textBlocks: [],
  };

  toggleFlash() {
    this.setState({
      flash: flashModeOrder[this.state.flash],
    });
  }

  toggleTextColor() {
    let textColorIndex = this.state.textColorIndex;
    textColorIndex++;
    if (textColorIndex >= textColors.length) {
      textColorIndex = 0;
    }
    this.setState({textColorIndex});
  }

  toggle = (value) => () =>
    this.setState((prevState) => ({[value]: !prevState[value]}));

  renderTextBlocks = () => (
    <View style={styles.textContainer} pointerEvents="none">
      {this.state.textBlocks.map(this.renderTextBlock)}
    </View>
  );

  renderTextBlock = ({bounds, value}) => (
    <React.Fragment key={value + bounds.origin.x}>
      <Text
        style={[
          styles.textBlock,
          {
            left: bounds.origin.x,
            top: bounds.origin.y,
            color: textColors[this.state.textColorIndex],
          },
        ]}>
        {value}
      </Text>
    </React.Fragment>
  );

  textRecognized = (object) => {
    const {textBlocks} = object;
    this.setState({textBlocks});
  };

  renderCamera() {
    return (
      <RNCamera
        captureAudio={false}
        ref={(ref) => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
        }}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        focusDepth={this.state.depth}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onTextRecognized={
          this.state.canDetectText ? this.textRecognized : null
        }>
        <View>
          <View
            style={{
              backgroundColor: 'transparent',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={this.toggle('canDetectText')}
              style={styles.flipButton}>
              <Text style={styles.flipText}>
                {!this.state.canDetectText ? 'Show Text' : 'Hide Text'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.flipButton}
              onPress={this.toggleFlash.bind(this)}>
              <Text style={styles.flipText}> FLASH: {this.state.flash} </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: 'transparent',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={this.toggleTextColor.bind(this)}
              style={styles.flipButton}>
              <Text style={styles.flipText}>{'Change Text Color'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {!!this.state.canDetectText && this.renderTextBlocks()}
      </RNCamera>
    );
  }

  render() {
    return <View style={styles.container}>{this.renderCamera()}</View>;
  }
}

const textColors = ['red', 'blue', 'black', 'white'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#000',
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  text: {
    fontSize: 15,
    padding: 5,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    justifyContent: 'center',
  },
  textBlock: {
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});
