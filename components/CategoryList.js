import React from 'react';
import PropTypes from 'prop-types';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Card, CardItem} from 'native-base';
import Amplitude from '../constants/analytics';
import ImageToCahce from '../components/ImageToCache'

export default class CategoryList extends React.Component {
    render() {
        const {list, onImagePress, categoryName} = this.props;

        return (
            <ScrollView 
                onScroll= {({nativeEvent}) => {
                    const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
                    const paddingToBottom = 20;
                    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
                        Amplitude.logEventWithProperties("CATEGORY_LISTED_TO_END", {"category": categoryName});
                    }
                }}
            >
                {list.map((item, itemIndex) => {
                    return(
                        <View key={item.name} style={{borderRadius: 20, marginBottom: 10}}>
                            <Card style={{borderRadius: 20, marginLeft: 10, marginRight: 10}}>
                                <CardItem style={styles.cardItem} button={true} onPress={() => { onImagePress(itemIndex) }}>
                                    <ImageToCahce style={styles.gridItemImage} url={item.imageMin} name={'min-' + item.name}/>
                                </CardItem>
                            </Card>
                        </View>
                    );
                })}
            </ScrollView>
        );
    }
}

CategoryList.propTypes = {
    list: PropTypes.array.isRequired,
    onImagePress: PropTypes.func.isRequired,
    categoryName: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
    cardItem: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0
    },
    gridItemImage: {
        height: 300,
        width: '100%',
        borderRadius: 20
    }
});