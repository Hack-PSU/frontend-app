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
                backgroundColor={Platform.OS === 'ios' ? 'white' : '#F5F5F5'}

                tintColor = 'rgba(106, 133, 185,0.3)'
                // fontStyle={{ color: TEXT_LIGHT }}
                // The color of the non-selected items
                fontStyle = {{color:"grey"}}
                //The color of the selected item
                activeFontStyle={{ color: "#6A85B9" }}
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
