export interface EventModelJSON {
  uid: string;
  event_title: string;
  event_type: string;
  event_start_time: string;
  event_end_time: string;
  event_description: string;
  location_name: string;
}

export class EventModel {
  public uid: string;
  public event_title: string;
  public event_type: string;
  public event_start_time: string;
  public event_end_time: string;
  public event_description: string;
  public location_name: string;

  static parseJSON(value: EventModelJSON): EventModel {
    const event = new EventModel();
    return Object.assign(event, value);
  }

  static parseFromJSONArray(array: EventModelJSON[]): EventModel[] {
    return array.map((value) => {
      const event = new EventModel();
      return Object.assign(event, value);
    });
  }
}