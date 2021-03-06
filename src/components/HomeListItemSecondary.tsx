import React from 'react'
import { StyleSheet } from 'react-native'
import { Card, Title } from 'react-native-paper'

interface Props {
    description: React.ReactNode
    onPress?: any
    children: React.ReactNode
}

const HomeListItemHorizontal: React.FC<Props> = (props) => {
    return (
        <Card style={styles.card} onPress={props.onPress}>
            <Card.Content>
                <Title style={styles.headline}>{props.description}</Title>
                {props.children}
            </Card.Content>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        marginBottom: 10,
        marginLeft: 5,
        marginRight: 5,
    },

    headline: {
        marginBottom: 10,
        opacity: 0.87,
    },
})

export default HomeListItemHorizontal
