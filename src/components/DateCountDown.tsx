import React from 'react'
import TimeCard from './TimeCard'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'

interface State {
    today: Date
}

export default class DateCountDown extends React.Component<{}, State> {
    readonly hackathonStart = new Date('March 19, 2021 17:00:00') // March 19, 2021 5:00 pm
    readonly hackathonEnd = new Date('March 21, 2021 17:00:00') // March 21, 2021 5:00 pm
    timerID: NodeJS.Timeout

    constructor(props) {
        super(props)

        this.state = {
            today: new Date(),
        }
    }

    tick = () => {
        this.setState({
            today: new Date(),
        })
    }

    componentDidMount() {
        // Don't waste processing power on calculation and state updates if time has passed
        if (this.hackathonEnd.getTime() - this.state.today.getTime() >= 0) {
            this.timerID = setInterval(this.tick, 1000)
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }

    render() {
        let descriptionText: string
        let dateToCalculate: Date

        // Don't have this component show up after the event
        if (this.hackathonEnd.getTime() - this.state.today.getTime() < 0) {
            return <TimeCard title={'Hackathon Ended'} time={'Join us next time!'} />
        } else if (this.hackathonStart.getTime() - this.state.today.getTime() > 0) {
            // If it's before the hackathon, calculate the time left before it starts
            descriptionText = 'Time until Hackathon'
            dateToCalculate = this.hackathonStart
        } else {
            // If the hackathon started, calculate the time left before it ends
            descriptionText = 'Time left to Submit'
            dateToCalculate = this.hackathonEnd
        }

        const parsedTimeLeft = formatDistanceStrict(new Date(), dateToCalculate)
        return <TimeCard title={descriptionText + ':'} time={parsedTimeLeft} />
    }
}
