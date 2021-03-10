import React from 'react'
import { StyleSheet, View, Linking } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface Props {
    sponsorURL?: string
    children?: React.ReactNode
}

const SponsorLogo: React.FC<Props> = (props) => {
    return (
        <View style={styles.logoContainer}>
            {/* If there is a URl for the sponsor then use TouchableOpacity, else use View */}
            {props.sponsorURL ? (
                <TouchableOpacity onPress={() => Linking.openURL(props.sponsorURL)}>
                    {props.children}
                </TouchableOpacity>
            ) : (
                <View>{props.children}</View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default SponsorLogo
