import React, { useState } from 'react'
import {
    View,
    Image,
    StyleSheet,
    Platform,
    Linking,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
} from 'react-native'
import { FAB, Caption } from 'react-native-paper'
// https://github.com/ascoders/react-native-image-viewer
import ImageViewer from 'react-native-image-zoom-viewer'

import { Asset } from 'expo-asset'

import Scaffold from '../components/Scaffold'

const BuildingMap = Asset.fromModule(require('../../assets/images/BuildingMap.png'))

const MAP_WIDTH = 10800
const MAP_HEIGHT = 7200
const MAP_ASPECT_RATIO = MAP_WIDTH / MAP_HEIGHT

const MapRoute: React.FC = () => {
    // The modal is used for the image zoom viewer
    const [isModalVisible, changeIsModalVisible] = useState(false)

    const imageLoaded = { loading: false }
    // const imageLoaded = useAsyncData<boolean>(async () => {
    //     await BuildingMap.downloadAsync()
    //     return true
    // })

    // Opens phone's default map app with the address for the Business Building
    const openMaps = () => {
        let scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:'
        Linking.openURL(scheme + '40.803983,-77.865197?q=Business Building')
    }

    // This is needed for image zoom viewer
    const image = [
        {
            url: '',
            props: {
                source: BuildingMap,
            },
        },
    ]

    return (
        <Scaffold smallLogo>
            <Modal
                animationType="fade"
                visible={isModalVisible}
                transparent={true}
                onRequestClose={() => changeIsModalVisible(false)}
            >
                <ImageViewer
                    imageUrls={image}
                    onClick={() => changeIsModalVisible(false)}
                    enableSwipeDown={true}
                    onCancel={() => changeIsModalVisible(false)}
                    renderIndicator={() => null}
                />
            </Modal>

            <View style={styles.root}>
                <Caption style={styles.caption}>Touch the image to move and zoom.</Caption>

                {(imageLoaded.loading || !BuildingMap.downloaded) && (
                    <View style={styles.loading}>
                        <ActivityIndicator animating size="large" />
                    </View>
                )}

                {!imageLoaded.loading && BuildingMap.downloaded && (
                    <TouchableOpacity
                        style={styles.touchable}
                        onPress={() => changeIsModalVisible(true)}
                    >
                        <Image style={styles.image} source={BuildingMap} />
                    </TouchableOpacity>
                )}

                <View style={styles.bottom}>
                    <FAB icon="map" onPress={openMaps} label="Directions" />
                </View>
            </View>
        </Scaffold>
    )
}

const styles = StyleSheet.create({
    root: {
        height: '100%',
        width: '100%',
        paddingTop: 10,
        paddingBottom: 80,
        paddingHorizontal: 10,
        alignContent: 'center',
        justifyContent: 'center',
    },

    touchable: {
        width: '100%',
        aspectRatio: MAP_ASPECT_RATIO,
    },

    caption: {
        color: 'white',
    },

    loading: {
        width: '100%',
        aspectRatio: MAP_ASPECT_RATIO,
    },

    image: {
        flex: 1,
        width: '100%',
        resizeMode: 'contain',
    },

    bottom: {
        position: 'absolute',
        width: '100%',
        bottom: Platform.OS === 'ios' ? 116 : 72,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
})

export default MapRoute
