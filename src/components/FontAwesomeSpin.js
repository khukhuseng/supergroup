import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

class FontAwesomeSpin extends Component {

    spinValue = new Animated.Value(0);

    componentDidMount(){
        this.spin();
    };

    spin = () => {
        this.spinValue.setValue(0);
        Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start(() => this.spin());
    };

    render() {
        const rotate = this.spinValue.interpolate({inputRange: [0, 1], outputRange: ['0deg', '360deg']});
        return(
            <Animated.View style={{transform: [{rotate}]}}>
                <FontAwesome name={'spinner'} color={'#fff'} size={30} regular/>
            </Animated.View>
        )

    }
}

export default FontAwesomeSpin;