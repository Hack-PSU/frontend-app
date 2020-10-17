import React from 'react'
import { AlertType } from 'react-native'
import { Button, Dialog, Paragraph, Portal, TextInput } from 'react-native-paper'

// Making this a separate interface will make the code cleaner when using this component.
export interface AndroidPromptData {
    title: string
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
    const [text, setText] = React.useState('')

    // If we pass no string, nothing will update server side and the dialog will close.
    const hideDialog = (): void => {
        androidPromptData.updateFunc(null)
    }

    // Avoid errors on optional prop
    if (androidPromptData.type === undefined) {
        androidPromptData.type = 'secure-text'
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>{androidPromptData.title}</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>{androidPromptData.description}</Paragraph>
                    <TextInput
                        value={text}
                        onChangeText={setText}
                        // TODO: Make themeing and stuff
                        style={{ color: '#FFFFFF', backgroundColor: '#FFFFFF' }}
                        secureTextEntry={androidPromptData.type === 'secure-text'}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hideDialog}>Cancel</Button>
                    <Button onPress={() => androidPromptData.updateFunc(text)}>Done</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default AndroidPrompt
