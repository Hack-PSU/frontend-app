import { RegistrationApiResponse } from "../models/registration";

import { fetchWithAuth } from "../fetch";

export class DataService {
  // TODO: Frontend doesn't use a cache for this... but should it?
  async getRegistrationStatus(currentUser: firebase.User): Promise<RegistrationApiResponse> {
    const registrations = await fetchWithAuth<RegistrationApiResponse[]>("users/register", currentUser, true);

    if (!registrations || !registrations.length) {
      return null;
    }

    return RegistrationApiResponse.parseJSON(registrations[0]);
  }
}

const singleton = new DataService();
export default singleton;