import React from "react";

import EventWorkshopPage, { WORKSHOPS } from "../components/EventWorkshopPage";

const WorkshopsRoute: React.FC = () => {
  return <EventWorkshopPage eventType={WORKSHOPS} />;
};

export default WorkshopsRoute;
