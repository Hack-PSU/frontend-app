import format from 'date-fns/format'

export interface EventModelJSON {
    uid: string
    event_title: string
    event_type: string
    event_start_time: string
    event_end_time: string
    event_description: string
    location_name: string
    starred?: boolean // This will only be used when reading from the storage for starred (offline) events
}

// Date formats.
// See options here: https://date-fns.org/v2.6.0/docs/format

// Displays like 12:05p
const TIME = 'h:mmaaaaa'
// Displays 'Sunday', etc.
const WEEKDAY = 'EEEE'

export class EventModel {
    public uid: string
    public event_title: string
    public event_type: string
    public event_start_time: Date
    public event_end_time: Date
    public event_description: string
    public location_name: string
    public starred: boolean

    static parseJSON(value: EventModelJSON): EventModel {
        const event = new EventModel()
        Object.assign(event, value)

        event.event_start_time = new Date(parseFloat(value.event_start_time))
        event.event_end_time = new Date(parseFloat(value.event_end_time))

        if (value.starred == null) {
            event.starred = false
        }

        return event
    }

    static parseFromJSONArray(array: EventModelJSON[]): EventModel[] {
        return array.map((value) => {
            return EventModel.parseJSON(value)
        })
    }

    formatInfo(): string {
        const startDate = this.event_start_time
        const endDate = this.event_end_time

        return format(startDate, TIME) + ' — ' + format(endDate, TIME)
    }

    getWeekday() {
        return format(this.event_start_time, WEEKDAY)
    }
}
