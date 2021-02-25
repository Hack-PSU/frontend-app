import React from 'react'
import { StyleSheet } from 'react-native'
import { Card, Title, Headline } from 'react-native-paper'
import { TEXT_LIGHT } from '../theme'

interface Props {
    description?: string
    info?: string
}

const TimeCard: React.FC<Props> = (props) => {
    return (
        <Card style={styles.card}>
            <Card.Content>
                {props.description && (
                    <Title style={styles.description}>{props.description}:</Title>
                )}
                {props.info && <Headline style={styles.info}>{props.info}</Headline>}
            </Card.Content>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: 'transparent',
    },

    description: {
        marginBottom: 10,
        opacity: 0.87,
        fontSize: 23,
        fontFamily: 'SpaceGrotesk',
        color: TEXT_LIGHT,
    },

    info: {
        fontSize: 35,
        padding: 4,
        fontFamily: 'SpaceGrotesk',
        color: TEXT_LIGHT,
    },
})

export default TimeCard
