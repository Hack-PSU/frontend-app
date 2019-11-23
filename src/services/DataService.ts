import { observable } from "mobx";

import { RegistrationApiResponse } from "../models/registration";
import { EventModel, EventModelJSON } from "../models/event-model";

import { fetch, fetchWithAuth } from "../fetch";

export class DataService {
  // TODO: Frontend doesn't use a cache for this... but should it?
  async getRegistrationStatus(currentUser: firebase.User): Promise<RegistrationApiResponse> {
    const registrations = await fetchWithAuth<RegistrationApiResponse[]>("users/register", currentUser, true);

    if (!registrations || !registrations.length) {
      return null;
    }

    return RegistrationApiResponse.parseJSON(registrations[0]);
  }

  @observable
  events: EventModel[];

  async getEvents(): Promise<EventModel[]> {
    if (!this.events) {
      const eventsRaw = await fetch<EventModelJSON[]>("live/events");
      this.events = EventModel.parseFromJSONArray(eventsRaw);
    }

    return this.events;
  }
}

const singleton = new DataService();
export default singleton;