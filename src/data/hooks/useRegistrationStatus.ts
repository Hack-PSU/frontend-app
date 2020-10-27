import useSWR from 'swr'

import { compareFunc } from '@dji-dev/us-web-util'
import addWeeks from 'date-fns/addWeeks'
import isPast from 'date-fns/isPast'

import { RegistrationApiResponse } from '../../models/registration'

function transformData(registrations: RegistrationApiResponse[] | null) {
    if (!registrations || !registrations.length) {
        return null
    }

    // Get most recent hackathon by sorting in reverse order.
    const hackathon = registrations.sort((a, b) => {
        return compareFunc(
            new Date(parseFloat(b.end_time)).getTime(),
            new Date(parseFloat(a.end_time)).getTime()
        )
    })[0]

    const hackathonDate = new Date(parseFloat(hackathon.end_time))
    // If too far in the past (3 weeks ago) return null.
    if (isPast(addWeeks(hackathonDate, 3))) {
        return null
    }

    return RegistrationApiResponse.parseJSON(hackathon)
}

export default function useRegistrationStatus() {
    return useSWR<RegistrationApiResponse | null>(['users/register', transformData])
}
