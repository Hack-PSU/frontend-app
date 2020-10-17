import React from 'react'
import { View, AlertType } from 'react-native'

interface Props {
    title: string
    description: string
    updateFunc: (arg0: string) => unknown
    type?: AlertType
}

const AndroidIosPrompt: React.FC<Props> = (props) => {
    return <View />
}

export default AndroidIosPrompt
