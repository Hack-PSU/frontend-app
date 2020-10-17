import React, { useState } from 'react'
import { AlertType } from 'react-native'
import { Button, Dialog, Paragraph, Portal, TextInput } from 'react-native-paper'

interface Props {
    title: string
    description: string
    updateFunc: (arg0: string) => unknown
    visible: boolean
    type?: AlertType
}

const AndroidIosPrompt: React.FC<Props> = (props) => {
    const [text, setText] = useState('')

    // TODO: See if this is even valid. Might want to change this to "updateFunc" if that changes the visible state of the dialog
    const hideDialog = () => (props.visible = false)

    if (!props.type) {
        props.type = 'secure-text'
    }

    return (
        <Portal>
            <Dialog visible={props.visible} onDismiss={hideDialog}>
                <Dialog.Title>{props.title}</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>{props.description}</Paragraph>
                    <TextInput
                        value={text}
                        onChangeText={setText}
                        secureTextEntry={props.type === 'secure-text'}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hideDialog}>Cancel</Button>
                    <Button onPress={() => {}}>Done</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default AndroidIosPrompt
