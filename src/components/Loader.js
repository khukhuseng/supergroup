import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import Modal from "react-native-modal";
import FontAwesomeSpin from './FontAwesomeSpin';

const Loader = props => {
    const {
        loading,
        text,
        ...attributes
    } = props;

    return (
        <Modal
            transparent={true}
            animationType={'none'}
            visible={loading}
            onRequestClose={() => { console.log('close modal') }}
            backdropOpacity={0}
            hasBackdrop={false}
        >
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <FontAwesomeSpin />
                    <Text style={{ color: '#fff', fontSize: 14, marginTop: 15, fontFamily: 'arial' }}>{text}</Text>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        //backgroundColor: '#666',
        paddingBottom: '10%'
    },
    activityIndicatorWrapper: {
        opacity: 0.9,
        backgroundColor: '#666',
        width: 130,
        borderRadius: 6,
        padding: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});

export default Loader;