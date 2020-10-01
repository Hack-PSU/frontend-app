import useSWR from 'swr'
import { compareFunc } from '@dji-dev/us-web-util'

import { EventModel, EventModelJSON } from '../../models/event-model'

function transformData(eventsRaw: EventModelJSON[] | null) {
    if (!eventsRaw) {
        return
    }

    return EventModel.parseFromJSONArray(eventsRaw).sort((a, b) => {
        return compareFunc(a.event_start_time.getTime(), b.event_start_time.getTime())
    })
}

export default function useEvents() {
    return useSWR<EventModel[] | null>(['live/events', transformData])
}
