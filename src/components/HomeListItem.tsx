import React from 'react'
import { StyleSheet } from 'react-native'
import { Card, Title, Headline } from 'react-native-paper'

import { TEXT } from '../theme'

interface Props {
    description?: string
    info?: string
    onPress?: any
    children?: React.ReactNode
}

const HomeListItem: React.FC<Props> = (props) => {
    return (
        <Card style={styles.card} onPress={props.onPress}>
            <Card.Content>
                {props.description && <Title style={styles.description}>{props.description}</Title>}
                {props.info && <Headline style={styles.info}>{props.info}</Headline>}
                {props.children}
            </Card.Content>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        marginLeft: 16,
        marginRight: 16,
    },

    description: {
        marginLeft: 8,
        marginBottom: 16,
        opacity: 0.87,
        fontFamily: 'SpaceGrotesk',
    },

    info: {
        color: TEXT,
    },
})

export default HomeListItem
