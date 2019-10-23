import React from "react";
import { View, Text, FlatList } from "react-native";

import Scaffold from "../components/Scaffold";
import Subtitle from "../components/Subtitle";

interface Item {
  title: string;
  presenter: string;
  image: string;
  isSponsor?: boolean;
  startTime: string;
  endTime: string;
  day: string;
}

const FAKE_DATA: Item[] = [
  {
    title: "Google Wants You",
    presenter: "Jonathan Doeman",
    image: "https://live.staticflickr.com/6150/5932366528_46703392d6_b.jpg",
    isSponsor: true,
    startTime: "12:30",
    endTime: "2:30",
    day: "11/2/19"
  }
];

interface ItemProps {
  item: Item;
}

const ItemComponent: React.FC<ItemProps> = ({ item }) => {
  return <Text>{item.title}</Text>;
};

const EventsRoute: React.FC = () => {
  return (
    <Scaffold title="Events">
      <FlatList
        data={FAKE_DATA}
        renderItem={({ item }) => <ItemComponent item={item} />}
        ListHeaderComponent={<Subtitle>Events</Subtitle>}
      />
    </Scaffold>
  );
};

export default EventsRoute;
