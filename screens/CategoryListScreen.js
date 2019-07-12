import React from 'react';
import { Container } from 'native-base';
import { StyleSheet, Dimensions, PixelRatio, ActivityIndicator, Text} from 'react-native';
import CategoryList from '../components/CategoryList';
import { AdMobBanner } from 'expo';
import { fetchCategoryData } from '../utils/api';

export default class CategoryListScreen extends React.Component {
    state = {
        list: [],
        categoryName: "",
        loading: true,
        loaded: false
    };

    async componentDidMount() {
        const { navigation: { state: { params } } } = this.props;
        const { category } = params;

        this.setState({
            categoryName: category.name
        });

        try {
            const list = await fetchCategoryData(category.list);
            this.setState({
                loading: false,
                list
            });
        } catch (e) {
            this.setState({
                loading: false,
                error: true
            });
        }
    }

    onImagePress = (imageNum) => {
        const { navigation: { navigate } } = this.props;
        const { list } = this.state;

        navigate('ImageView', {
            imageNum,
            imagesList: list,
            categoryName: this.state.categoryName
        });
    }

    render() {
        const {loading, error, list, categoryName} = this.state;

        if (loading) {
            return <ActivityIndicator size="large" style={styles.loader} />;
        }

        if (error) {
            console.log(error);
            return <Text>Извините! Попробуйте еще раз позже :)</Text>;
        }

        return (
            <Container>
                <CategoryList 
                    list={list}
                    onImagePress={this.onImagePress.bind(this)}
                    categoryName={categoryName} />
                <AdMobBanner
                    style={styles.bottom}
                    bannerSize="fullBanner"
                    adUnitID="ca-app-pub-3940256099942544/6300978111"
                    testDeviceID="EMULATOR"
                    onDidFailToReceiveAdWithError={this.bannerError} />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    gridList: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    container: {
        flex: 1
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        height: 60,
        zIndex: 300,
        marginBottom: (Dimensions.get('window').width * PixelRatio.get() > 800) ? 30 : 0
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
    }
});