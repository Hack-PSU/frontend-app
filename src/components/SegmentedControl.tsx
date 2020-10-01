import React from 'react'
import CommunitySegmentedControl from '@react-native-community/segmented-control'
import { StyleSheet, View, Platform } from 'react-native'
import { TEXT_LIGHT, TEXT } from '../theme'

interface Props {
    values: string[]
    value: string
    onChange: (newValue: string) => any
}

const SegmentedControl: React.FC<Props> = ({ values, value, onChange }) => {
    // @ts-ignore
    return (
        <View style={styles.buttonGroup}>
            <CommunitySegmentedControl
                selectedIndex={values.indexOf(value)}
                onChange={(event) => onChange(values[event.nativeEvent.selectedSegmentIndex])}
                values={values}
                backgroundColor={Platform.OS === 'ios' ? undefined : 'rgba(255,255,255,0.1)'}
                textColor={TEXT_LIGHT}
                activeTextColor={TEXT}
            />
        </View>
    )
}

export default SegmentedControl

const styles = StyleSheet.create({
    buttonGroup: {
        marginLeft: 32,
        marginRight: 32,
        borderRadius: 8,
    },
})
