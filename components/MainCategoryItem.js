import React from 'react';
import { ListItem, Text } from 'native-base';
import { StyleSheet, Image, View } from 'react-native';
import Amplitude from '../constants/analytics';

export default function MainCategoryItem({item, onPress}) {
    return (
        <ListItem style={styles.item} onPress={() => {
            Amplitude.logEventWithProperties("OPENED_CATEGORY", {"category": item.name});
            onPress();
        }}>
            <View style={styles.container}>
                <Image source={item.getIcon()} style={styles.image}/>
                <Text>{item.name}</Text>
            </View>
        </ListItem>
    );
};

const styles = StyleSheet.create({
    item: {
        color: "#fff"
    },
    image: {
        width: 40,
        height: 40,
        marginRight: 20
    },
    container: {
        flex: 1,
        flexDirection: 'row',
    }
});