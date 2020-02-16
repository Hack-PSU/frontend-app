import { observable } from "mobx";
import { isPast, addWeeks } from "date-fns";

import { RegistrationApiResponse } from "../models/registration";
import { EventModel, EventModelJSON } from "../models/event-model";

import { httpGet, httpGetWithAuth } from "../httpGet";
import { AsyncData, createAsyncData, fetchAsyncData } from "../AsyncData";
import { compare } from "../utils";

export class DataService {
  @observable
  registrationStatus: AsyncData<
    RegistrationApiResponse | undefined
  > = createAsyncData();

  @observable
  events: AsyncData<EventModel[]> = createAsyncData();

  // Caches registration data per session storage.
  fetchRegistrationStatus(
    currentUser: firebase.User,
    force: boolean = false
  ): Promise<void> {
    return fetchAsyncData(this.registrationStatus, async () => {
      const registrations = await httpGetWithAuth<RegistrationApiResponse[]>(
        "users/register",
        currentUser,
        {
          force
        }
      );

      if (!registrations || !registrations.length) {
        return;
      }

      // Get most recent hackathon by sorting in reverse order.
      const hackathon = registrations.sort((a, b) => {
        return compare(
          new Date(parseFloat(b.end_time)).getTime(),
          new Date(parseFloat(a.end_time)).getTime()
        );
      })[0];

      const hackathonDate = new Date(parseFloat(hackathon.end_time));
      // If too far in the past (3 weeks ago) return null.
      if (isPast(addWeeks(hackathonDate, 3))) {
        return;
      }

      return RegistrationApiResponse.parseJSON(hackathon);
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
