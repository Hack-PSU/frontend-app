import React from "react";
import {} from "react-native";
import HomeListItem from "./HomeListItem";

interface State {
  timeLeft: string;
}

export default class DateCounter extends React.Component<{}, State> {
  constructor(props) {
    super(props);

    this.state = {
      timeLeft: "..."
    };
  }

  updateTime = () => {
    const today = new Date();
    const hackathonDate = new Date("April 4, 2020 07:00:00"); // April 4, 2020, 7:00am
    let milliDifference = hackathonDate.getTime() - today.getTime();

    // Might need to change floor to ceil
    const days = Math.floor(milliDifference / (1000 * 60 * 60 * 24));
    milliDifference -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(milliDifference / (1000 * 60 * 60));
    milliDifference -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(milliDifference / (1000 * 60));
    milliDifference -= minutes * (1000 * 60);
    const seconds = Math.floor(milliDifference / 1000);

    this.setState({
      timeLeft: `${days} days, ${hours} hrs, ${minutes} mins, ${seconds} s`
    });
  };

  componentDidMount() {
    setInterval(this.updateTime, 1000);
  }

  render() {
    return <HomeListItem description="Time Left" info={this.state.timeLeft} />;
  }
}
