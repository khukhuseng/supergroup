import React, { Component } from 'react';
import { View, ActivityIndicator, ImageBackground, StyleSheet } from 'react-native';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';

export default class SplashScreen extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <ImageBackground
                    source={require("../assets/images/splash_screen.jpg")}
                    resizeMode="cover"
                    style={styles.splashScreen}
                >
                    <ActivityIndicator size={"large"} color={"#fff"} style={styles.splashScreenLoading} />
                </ImageBackground>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    splashScreen: {
        width: responsiveWidth(100),
        height: responsiveHeight(100),
        justifyContent: "center"
    },
});

