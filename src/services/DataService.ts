import { observable } from "mobx";

import { RegistrationApiResponse } from "../models/registration";
import { EventModel, EventModelJSON } from "../models/event-model";

import { httpGet, httpGetWithAuth } from "../httpGet";
import { AsyncData, createAsyncData, fetchAsyncData } from "../AsyncData";

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
  registrationStatus: AsyncData<
    RegistrationApiResponse | undefined
  > = createAsyncData();

  @observable
  events: AsyncData<EventModel[]> = createAsyncData();

  // TODO: Frontend doesn't use a cache for this... but should it?
  fetchRegistrationStatus(currentUser: firebase.User): Promise<void> {
    return fetchAsyncData(this.registrationStatus, async () => {
      const registrations = await httpGetWithAuth<RegistrationApiResponse[]>(
        "users/register",
        currentUser,
        true
      );

      if (!registrations || !registrations.length) {
        return;
      }

      return RegistrationApiResponse.parseJSON(registrations[0]);
    });
  }

  fetchEvents(): Promise<void> {
    return fetchAsyncData(this.events, async () => {
      const eventsRaw = await httpGet<EventModelJSON[]>("live/events");

      if (!eventsRaw) {
        return;
      }

      return EventModel.parseFromJSONArray(eventsRaw).sort((a, b) => {
        return compare(
          a.event_start_time.getTime(),
          b.event_start_time.getTime()
        );
      });
    });
  }
}

const singleton = new DataService();
export default singleton;
