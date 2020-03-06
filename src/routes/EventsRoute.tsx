import React from "react";

import EventWorkshopPage, { EVENTS } from "../components/EventWorkshopPage";

const EventsRoute: React.FC = () => {
  return <EventWorkshopPage eventType={EVENTS} />;
};

export default EventsRoute;
