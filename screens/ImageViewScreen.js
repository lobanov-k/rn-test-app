import React from 'react';
import { Share, View, StyleSheet, TouchableOpacity, Dimensions, PixelRatio, ActivityIndicator } from 'react-native';
import { Text } from 'native-base';
import Gallery from 'react-native-image-gallery';
import { AdMobBanner, AdMobInterstitial } from 'expo-ads-admob';
import { ViewContext } from '../context/views-context';
import Amplitude from '../constants/analytics';
import { getImageByUrl } from '../utils/get-images';
import * as FileSystem from 'expo-file-system';

export default class ImageViewScreen extends React.Component {

    constructor (props) {
        super(props);
        const { navigation: { state: { params : {imagesList, categoryName} } } } = this.props;
        this.imagesList = imagesList;
        this.categoryName = categoryName;
        this.sentGalleryViewedEvents = [];
        this.isIntersitialReady = false;
    }

    state = {
        isReady: false
    };

    async componentDidMount() {
        try {
            const downloadedImgsList = this.imagesList.map((imageItem) => {
                const namePrefix = imageItem.type == "image/gif" ? '' : 'min-';
                const urlTodownload = imageItem.type == "image/gif" ? imageItem.image : imageItem.imageMin || imageItem.image;
                return getImageByUrl(urlTodownload, namePrefix + imageItem.name);
            });
            Promise.all(downloadedImgsList).then(() => {
                this.setState({isReady: true});
            });
        } catch (e) {
            console.log(e);
        }

        AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712');
        AdMobInterstitial.setTestDeviceID('EMULATOR');
        const isIntersitialReady = await AdMobInterstitial.getIsReadyAsync();
        if (isIntersitialReady) {
            this.isIntersitialReady = true;
        } else {
            AdMobInterstitial.requestAdAsync();
        }

        AdMobInterstitial.addEventListener('interstitialDidLoad', () => {
            this.isIntersitialReady = true;
        });
        AdMobInterstitial.addEventListener('interstitialDidClose', this.interstitialDidClose);
        AdMobInterstitial.addEventListener('interstitialDidFailToLoad', () => {});
        AdMobInterstitial.addEventListener('interstitialDidOpen', () => {});
        AdMobInterstitial.addEventListener('interstitialWillLeaveApplication', () => {});

    }

    setImageToShare = (imgNum) => {
        let viewedImgsCount = 0;

        const sendGalleryViewedEvent = (eventName) => {
            Amplitude.logEventWithProperties(eventName, {
                'category': this.categoryName
            });
        }

        this.currentImage = imgNum;
        this.imagesList[imgNum].viewed = true;
        this.imagesList.map((imgItem) => {
            if (!!imgItem.viewed) viewedImgsCount++;
        });
        if (viewedImgsCount == this.imagesList.length && this.sentGalleryViewedEvents.indexOf('GALLERY_VIEWED_100%') == -1) {
            sendGalleryViewedEvent('GALLERY_VIEWED_100%');
            this.sentGalleryViewedEvents.push('GALLERY_VIEWED_100%');
            return;
        }
        if (viewedImgsCount >= this.imagesList.length*0.75 && this.sentGalleryViewedEvents.indexOf('GALLERY_VIEWED_75%') == -1) {
            sendGalleryViewedEvent('GALLERY_VIEWED_75%');
            this.sentGalleryViewedEvents.push('GALLERY_VIEWED_75%');
            return;
        }
        if (viewedImgsCount >= this.imagesList.length*0.5 && this.sentGalleryViewedEvents.indexOf('GALLERY_VIEWED_50%') == -1) {
            sendGalleryViewedEvent('GALLERY_VIEWED_50%');
            this.sentGalleryViewedEvents.push('GALLERY_VIEWED_50%');
            return;
        }
        if (viewedImgsCount >= this.imagesList.length*0.25 && this.sentGalleryViewedEvents.indexOf('GALLERY_VIEWED_25%') == -1) {
            sendGalleryViewedEvent('GALLERY_VIEWED_25%');
            this.sentGalleryViewedEvents.push('GALLERY_VIEWED_25%');
            return;
        }
    };

    shareByButton = (settings) => {
        this.shareImage(this.currentImage, settings);
    };

    shareImage = async (position, settings) => {
        const { navigation: { state: { params : {imagesList, categoryName} } } } = this.props;
        const image = this.imagesList[position];
        const { shares } = settings;
        
        try {
            const result = await Share.share({
                url: image.source.uri,
                type: image.type,
                message: null
            });

            Amplitude.logEventWithProperties('SHARE', {
                'image': image.name,
                'shares_num': shares,
                'category': categoryName
            });

            if (result.action === Share.sharedAction) {
                await this.showIntersitialAd();
            } else if (result.action === Share.dismissedAction) {
                await this.showIntersitialAd();
                Amplitude.logEventWithProperties('ERROR_SHARE', {
                    'error': 'dismissed',
                    'image': image.name,
                    'shares_num': shares,
                    'category': categoryName
                });
            }
        } catch (error) {
            Amplitude.logEventWithProperties('ERROR_SHARE', {
                'error': error,
                'image': image.name,
                'shares_num': shares,
                'category': categoryName
            });
        }
    };

    async showIntersitialAd() {
        if (this.isIntersitialReady) {
            await AdMobInterstitial.showAdAsync();
        }
    }

    render() {
        if (!this.state.isReady) return <ActivityIndicator size="large" style={styles.loader}/>;

        const { navigation: { state: { params } } } = this.props;
        const { imageNum } = params;
        this.imagesList = this.imagesList.map((item) => {
            const namePrefix = item.type == "image/gif" ? '' : 'min-';
            return {
                dimensions: {
                    width: item.width,
                    height: item.height
                },
                source: {
                    uri: FileSystem.cacheDirectory + namePrefix + item.name
                }
            };
        });

        return(
            <View style={styles.container}>
                <AdMobBanner
                    bannerSize="fullBanner"
                    adUnitID="ca-app-pub-3940256099942544/6300978111"
                    testDeviceID="EMULATOR"
                    onDidFailToReceiveAdWithError={this.bannerError}
                    style={styles.adBanner} />
                <View style={styles.container}>
                    <Gallery
                        style={styles.gallery}
                        images={this.imagesList}
                        initialPage={imageNum}
                        onPageSelected={this.setImageToShare} />
                </View>
                <ViewContext.Consumer>
                    {({shares, incrementShares}) => {
                        return (
                            <TouchableOpacity 
                                onPress = {() => {
                                    const shares = incrementShares();
                                    this.shareByButton({shares_num: shares});
                                }}
                                style = {styles.buttonPosition} >
                                <Text style = {styles.shareButton}>Отправить</Text>
                            </TouchableOpacity>
                        );
                    }}
                </ViewContext.Consumer>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        minHeight: 100
    },
    adBanner: {
        marginBottom: 10,
        marginTop: 10,
        height: 60,
        zIndex: 100
    },
    gallery: {
        flex: 1,
        backgroundColor: '#fff'
    },
    buttonPosition: {
        alignItems: 'center',
        width: "100%",
        marginBottom: (Dimensions.get('window').width * PixelRatio.get() > 800) ? 30 : 5,
        marginTop: 10
    },
    shareButton: {
        backgroundColor: "#273ef6",
        justifyContent: 'center',
        borderColor: '#273ef6',
        borderWidth: 1,
        borderRadius: 5,
        color: 'white',
        fontSize: 18,
        overflow: 'hidden',
        padding: 12,
        paddingLeft: 30,
        paddingRight: 30,
        textAlign: 'center'
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
    }
});