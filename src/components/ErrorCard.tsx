import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { Card } from 'react-native-paper'

import { RED, ACCENT } from '../theme'

interface Props {
    error: Error
}

const ErrorCard: React.FC<Props> = ({ error }) => {
    return (
        <Card style={styles.card} onPress={() => console.log(error)}>
            <Card.Content>
                <Text>
                    Error: {error.message || error.toString()}. Please screenshot this and contact
                    the HackPSU team.
                </Text>
            </Card.Content>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: RED,
        borderColor: ACCENT,
        borderWidth: 2,
    },
})

export default ErrorCard
