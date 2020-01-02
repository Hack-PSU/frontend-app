import React from "react";
import HomeListItem from "./HomeListItem";
import { formatDistanceStrict } from "date-fns";

interface State {
  today: Date;
}

export default class DateCountDown extends React.Component<{}, State> {
  hackathonStart = new Date("April 4, 2020 14:00:00"); // April 4, 2020, 2:00 pm
  timerID: NodeJS.Timeout;

  constructor(props) {
    super(props);

    this.state = {
      today: new Date()
    };
  }

  tick = () => {
    this.setState({
      today: new Date()
    });
  };

  componentDidMount() {
    // Don't waste processing power on calculation and state updates if time has passed
    if (this.hackathonStart.getTime() - this.state.today.getTime() >= 0) {
      this.timerID = setInterval(this.tick, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    // Don't have this component show up during the event
    if (this.hackathonStart.getTime() - this.state.today.getTime() < 0) {
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
