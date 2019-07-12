import {createStackNavigator} from 'react-navigation';
import HomeScreenList from '../screens/HomeScreenList';
import CategoryListScreen from '../screens/CategoryListScreen';
import ImageViewScreen from '../screens/ImageViewScreen';

export default createStackNavigator({
    MainList: {
        screen: HomeScreenList,
        navigationOptions: {
            title: 'Категории'
        }
    },
    Category: {
        screen: CategoryListScreen,
        navigationOptions: ({ navigation: { state: { params } } }) => {
            const {category} = params;
            return {title: category.name};
        }
    },
    ImageView: {
        screen: ImageViewScreen
    }
});