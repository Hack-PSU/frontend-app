import React from "react";

import EventWorkshopPage from "../components/EventWorkshopPage";
import EventWorkshopListItem from "../components/EventWorkshopListItem";

const WorkshopsRoute: React.FC = () => {
  // This function is the same as EventsRoute, but will probably change when we get avatar images for workshops
  const renderItem = ({ item }) => (
    <EventWorkshopListItem key={item.uid} model={item} />
  );
  return <EventWorkshopPage eventType="Workshops" renderItem={renderItem} />;
};

export default WorkshopsRoute;
