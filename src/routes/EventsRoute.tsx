import React from "react";

import EventWorkshopPage from "../components/EventWorkshopPage";
import EventListItem from "../components/EventListItem";

const EventsRoute: React.FC = () => {
  const renderItem = ({ item }) => (
    <EventListItem key={item.uid} model={item} />
  );
  return <EventWorkshopPage eventType="Events" renderItem={renderItem} />;
};

export default EventsRoute;
