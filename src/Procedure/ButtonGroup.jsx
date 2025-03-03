import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

const ButtonGroup = ({ handleNext, handleLast}) => {
    return (
        <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button} onPress={handleLast}>
                <Text style={styles.buttonText}>上一步</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>下一步</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonGroup: {
        flexDirection: 'row',
        gap: 50,
        position: 'absolute',
        top: '90%',
        left: '35%',
    },
    button: {
        width: 192,
        height: 57,
        backgroundColor: '#39B8FF',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'rgba(12, 12, 13, 0.05)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
        fontWeight: '500',
    },
});

export default ButtonGroup;
