import React from 'react'
import { StyleSheet } from 'react-native'
import { Card, Title, Headline } from 'react-native-paper'
import { TEXT_LIGHT } from '../theme'

interface Props {
    title?: string
    time?: string
}

const TimeCard: React.FC<Props> = (props) => {
    return (
        <Card style={styles.card}>
            <Card.Content>
                {props.title && <Title style={styles.title}>{props.title}</Title>}
                {props.time && <Headline style={styles.time}>{props.time}</Headline>}
            </Card.Content>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
        marginLeft: 8,
        marginRight: 10,
        backgroundColor: 'transparent',
        elevation: 0,
    },

    title: {
        marginBottom: 10,
        opacity: 0.87,
        fontSize: 23,
        fontFamily: 'SpaceGrotesk',
        color: TEXT_LIGHT,
    },

    time: {
        fontSize: 35,
        marginLeft: -3.5,
        padding: 4,
        fontFamily: 'SpaceGrotesk',
        color: TEXT_LIGHT,
    },
})

export default TimeCard
