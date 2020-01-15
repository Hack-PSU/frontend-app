import { observable } from "mobx";

import { RegistrationApiResponse } from "../models/registration";
import { EventModel, EventModelJSON } from "../models/event-model";

import { httpGet, httpGetWithAuth } from "../httpGet";

function compare(a: number, b: number): -1 | 0 | 1 {
  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  // a must be equal to b
  return 0;
}

export class DataService {
  @observable
  events: EventModel[];

  // TODO: Frontend doesn't use a cache for this... but should it?
  async getRegistrationStatus(
    currentUser: firebase.User
  ): Promise<RegistrationApiResponse> {
    const registrations = await httpGetWithAuth<RegistrationApiResponse[]>(
      "users/register",
      currentUser,
      true
    );

    if (!registrations || !registrations.length) {
      return null;
    }

    return RegistrationApiResponse.parseJSON(registrations[0]);
  }

  async getEvents(): Promise<EventModel[]> {
    if (!this.events) {
      const eventsRaw = await httpGet<EventModelJSON[]>("live/events");

      if (!eventsRaw) {
        return []
      }

      this.events = EventModel.parseFromJSONArray(eventsRaw).sort((a, b) => {
        return compare(
          a.event_start_time.getTime(),
          b.event_start_time.getTime()
        );
      });
    }

    return this.events;
  }
}

const singleton = new DataService();
export default singleton;
