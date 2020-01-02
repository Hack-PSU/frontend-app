import React from "react";
import HomeListItem from "./HomeListItem";
import { formatDistanceStrict } from "date-fns";

interface State {
  timeLeft: number;
  timerID: NodeJS.Timeout;
}

export default class DateCountDown extends React.Component<{}, State> {
  hackathonStart = new Date("April 4, 2020 14:00:00"); // April 4, 2020, 2:00 pm

  constructor(props) {
    super(props);

    this.state = {
      timeLeft: 0,
      timerID: null
    };
  }

  updateTimeLeft = () => {
    const today = new Date();

    this.setState({
      timeLeft: this.hackathonStart.getTime() - today.getTime()
    });
  };

  componentDidMount() {
    // Don't waste processing power on calculation and state updates if time has passed
    if (this.state.timeLeft >= 0) {
      // Update time every second while passing the timerID to state
      this.setState({
        timerID: setInterval(this.updateTimeLeft, 1000)
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timerID);
  }

  render() {
    // Don't have this component show up during the event
    if (this.state.timeLeft < 0) {
      return null;
    }

    const parsedTimeLeft = formatDistanceStrict(
      new Date(),
      this.hackathonStart,
      { roundingMethod: "floor" }
    );
    return <HomeListItem description="Time Left" info={parsedTimeLeft} />;
  }
}
