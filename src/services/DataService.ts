import { observable } from "mobx";

import { RegistrationApiResponse } from "../models/registration";
import { EventModel, EventModelJSON } from "../models/event-model";

import { httpGet, httpGetWithAuth } from "../httpGet";

export class DataService {
  @observable
  events: EventModel[];

  // TODO: Frontend doesn't use a cache for this... but should it?
  async getRegistrationStatus(currentUser: firebase.User): Promise<RegistrationApiResponse> {
    const registrations = await httpGetWithAuth<RegistrationApiResponse[]>("users/register", currentUser, true);

    if (!registrations || !registrations.length) {
      return null;
    }

    return RegistrationApiResponse.parseJSON(registrations[0]);
  }

  async getEvents(): Promise<EventModel[]> {
    if (!this.events) {
      const eventsRaw = await httpGet<EventModelJSON[]>("live/events");
      this.events = EventModel.parseFromJSONArray(eventsRaw);
    }

    return this.events;
  }
}

const singleton = new DataService();
export default singleton;