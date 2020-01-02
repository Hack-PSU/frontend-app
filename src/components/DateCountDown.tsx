import React from "react";
import HomeListItem from "./HomeListItem";

interface State {
  timeLeft: number; // in seconds
  timerID: NodeJS.Timeout;
}

export default class DateCountDown extends React.Component<{}, State> {
  constructor(props) {
    super(props);

    this.state = {
      timeLeft: 0,
      timerID: null
    };
  }

  updateTimeLeft = () => {
    const today = new Date();
    const hackathonDate = new Date("April 4, 2020 07:00:00"); // April 4, 2020, 7:00am

    this.setState({
      timeLeft: (hackathonDate.getTime() - today.getTime()) / 1000
    });
  };

  parseTimeLeft = () => {
    let secondsDifference = this.state.timeLeft;

    const days = Math.floor(secondsDifference / (60 * 60 * 24));
    secondsDifference -= days * (60 * 60 * 24);
    const hours = Math.floor(secondsDifference / (60 * 60));
    secondsDifference -= hours * (60 * 60);
    const minutes = Math.floor(secondsDifference / 60);
    secondsDifference -= minutes * 60;
    const seconds = Math.floor(secondsDifference);

    return `${days} d, ${hours} h, ${minutes} m, ${seconds} s`;
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

    const parsedTimeLeft = this.parseTimeLeft();
    return <HomeListItem description="Time Left" info={parsedTimeLeft} />;
  }
}
