import React from 'react'
import { AlertType, StyleSheet } from 'react-native'
import { Button, Dialog, Portal, TextInput } from 'react-native-paper'

// Making this a separate interface will make the code cleaner when using this component.
export interface AndroidPromptData {
    title: string
    textLabel: string
    description: string
    updateFunc: (arg0: string) => unknown
    type?: AlertType
}

interface Props {
    androidPromptData: AndroidPromptData
    visible: boolean
}

// Must treat this as a regular component unlike native iOS Alert.

const AndroidPrompt: React.FC<Props> = ({ androidPromptData, visible }) => {
    const [text, setText] = React.useState<string>('')

    // If we pass no string, nothing will update server side and the dialog will close since the method that's passed
    // in will set this dialog invisible.
    // We use useCallback for a slight performance increase.
    const hideDialog = React.useCallback((): void => {
        androidPromptData.updateFunc(null)
        // Once the user hides the dialog, the state for text stays and will show that in a seemingly
        // different dialog.If the user edits their display name to "asdf" and then goes to edit
        // their email, the textinput will already be populated with "asdf".
        setText('')
    }, [androidPromptData])

    // Avoid errors on optional prop.
    if (androidPromptData.type === undefined) {
        androidPromptData.type = 'secure-text'
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>{androidPromptData.title}</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        value={text}
                        label={androidPromptData.textLabel}
                        placeholder={androidPromptData.description}
                        style={styles.textInput}
                        onChangeText={setText}
                        secureTextEntry={androidPromptData.type === 'secure-text'}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hideDialog}>Cancel</Button>
                    <Button
                        onPress={() => {
                            androidPromptData.updateFunc(text)
                            // Same reason as above.
                            setText('')
                        }}
                    >
                        Done
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

const styles = StyleSheet.create({
    // The default text input theme from https://github.com/callstack/react-native-paper/blob/master/src/styles/DefaultTheme.tsx
    // If we don't theme this we get the textInput background as the background we set in theme.ts, which is blue and
    // looks way off.
    textInput: {
        backgroundColor: '#f6f6f6',
    },
})

export default AndroidPrompt
