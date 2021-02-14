import React from 'react'
import HomeListItem from './HomeListItem'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'

interface State {
    today: Date
}

export default class DateCountDown extends React.Component<{}, State> {
    readonly hackathonStart = new Date('November 6, 2020 17:00:00') // November 6, 2020 5:00 pm
    readonly hackathonEnd = new Date('November 8, 2020 17:00:00') // November 8, 2020 5:00 pm
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
        // Don't have this component show up after the event
        if (this.hackathonEnd.getTime() - this.state.today.getTime() < 0) {
            return null
        }

        let descriptionText: string
        let dateToCalculate: Date

        if (this.hackathonStart.getTime() - this.state.today.getTime() > 0) {
            // If it's before the hackathon, calculate the time left before it starts
            descriptionText = 'Time until Hackathon'
            dateToCalculate = this.hackathonStart
        } else {
            // If the hackathon started, calculate the time left before it ends
            descriptionText = 'Time left'
            dateToCalculate = this.hackathonEnd
        }

        const parsedTimeLeft = formatDistanceStrict(new Date(), dateToCalculate)
        return <HomeListItem description={descriptionText} info={parsedTimeLeft} />
    }
}
