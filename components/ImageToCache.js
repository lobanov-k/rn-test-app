import React from 'react';
import PropTypes from 'prop-types';
import {Image, ActivityIndicator, View} from 'react-native';
import {getImageByUrl} from '../utils/get-images';

export default class ImageToCache extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        isReady: false,
        localImg: ''
    };

    async componentDidMount() {
        try {
            const fileData = await getImageByUrl(this.props.url, this.props.name);
            this.setState({
                isReady: true,
                localImg: (typeof fileData == 'string') ? fileData : fileData.uri
            });
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        if (!this.state.isReady) {
            return (
                <View style={this.props.style}>
                    <ActivityIndicator 
                        size="small" 
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    />
                </View>
            );
        }

        return (
            <Image source={{uri: this.state.localImg}} style={this.props.style}/>
        );

    };
};

ImageToCache.propTypes = {
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    style: PropTypes.object
};