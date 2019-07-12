import React from 'react';
import { List } from 'native-base';
import { StyleSheet, ScrollView } from 'react-native';
import MainCategoryItem from '../components/MainCategoryItem';
import categoriesList from '../configs/categories';

class HomeScreenList extends React.Component {
    state = {
        list: []
    };

    componentDidMount() {
        const list = categoriesList;
        this.setState({list});
    }

    renderCategory = (item) => {
      const { name, alias, image } = item;
      return <MainCategoryItem name={name} image={image} alias={alias} />;
    };
    
    render() {
      const { list } = this.state;
      const { navigation: { navigate } } = this.props;

      return (
        <ScrollView style={styles.container}>
            <List style={styles.list}>
              { list.map((item) => {
                const { alias } = item;
                return(
                  <MainCategoryItem
                    StackNavigator
                    item={item}
                    key={alias} 
                    onPress={() => {navigate('Category', {category: item})}}/>
                );
              }) }
            </List>
        </ScrollView>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  list: {
    backgroundColor: "#fff"
  }
});

export default HomeScreenList;
