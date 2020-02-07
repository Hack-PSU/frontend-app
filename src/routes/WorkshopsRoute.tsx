import React from "react";

import EventWorkshopPage from "../components/EventWorkshopPage";
import EventListItem from "../components/EventListItem";

const WorkshopsRoute: React.FC = () => {
  const renderItem = ({ item }) => (
    // TODO: Make a Workshops list item
    <EventListItem key={item.uid} model={item} />
  );
  return <EventWorkshopPage eventType="Workshops" renderItem={renderItem} />;
};

export default WorkshopsRoute;
