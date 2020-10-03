import React from 'react'
import { StyleSheet, Text } from 'react-native'

const styles = StyleSheet.create({
    pageTitle: {
        fontFamily: 'Cornerstone',
        paddingTop: 24,
        paddingBottom: 24,
        paddingLeft: 16,
        fontSize: 48,
        color: 'white',
    },
})

interface Props {
    children: string
    style?: any
}

const Subtitle: React.FC<Props> = ({ children, style }: Props) => {
    return <Text style={[styles.pageTitle, style]}>{children}</Text>
}

export default Subtitle
