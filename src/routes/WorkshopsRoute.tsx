import React from "react";

import EventWorkshopPage from "../components/EventWorkshopPage";
import EventWorkshopListItem from "../components/EventWorkshopListItem";

const WorkshopsRoute: React.FC = () => {
  const renderItem = ({ item }) => (
    <EventWorkshopListItem key={item.uid} model={item} />
  );
  return <EventWorkshopPage eventType="Workshops" renderItem={renderItem} />;
};

export default WorkshopsRoute;
