import React from "react";

import EventWorkshopPage from "../components/EventWorkshopPage";
import EventWorkshopListItem from "../components/EventWorkshopListItem";

const EventsRoute: React.FC = () => {
  const renderItem = ({ item }) => (
    <EventWorkshopListItem key={item.uid} model={item} />
  );
  return <EventWorkshopPage eventType="Events" renderItem={renderItem} />;
};

export default EventsRoute;
