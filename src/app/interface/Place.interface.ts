export interface Place {
  id: string;
  name: string;
}

export interface ApiResponseGetPlace {
  feed_publishers: FeedPublisher[];
  disruptions: any[];
  places: PlaceResult[];
  context: Context;
  links: Link[];
}

export interface FeedPublisher {
  id: string;
  name: string;
  url: string;
  license: string;
}

export interface Context {
  current_datetime: string;
  timezone: string;
}

export interface Link {
  href: string;
  templated: boolean;
  rel: string;
  type: string;
}

export interface PlaceResult {
  id: string;
  name: string;
  quality: number;
  embedded_type: 'administrative_region' | 'stop_area';

  administrative_region?: AdministrativeRegion;
  stop_area?: StopArea;
}

export interface Coord {
  lon: string;
  lat: string;
}

export interface AdministrativeRegion {
  id: string;
  name: string;
  level: number;
  zip_code: string;
  label: string;
  insee: string;
  coord: Coord;
}

export interface Code {
  type: string;
  value: string;
}

export interface StopArea {
  id: string;
  name: string;
  codes: Code[];
  timezone: string;
  label: string;
  coord: Coord;
  links: any[];
  administrative_regions: AdministrativeRegion[];
}

export interface ApiResponseJourneys {
  journeys: JourneyResult[];
  disruptions: any[];
  links: Link[];
}

export interface JourneyResult {
  id: string;
  status: string;
  departure_date_time: string;
  arrival_date_time: string;
  duration: number;
  nb_transfers: number;
  sections: Section[];
}

export interface Section {
  id: string;
  type: string;
  departure_date_time: string;
  arrival_date_time: string;
  duration: number;
  from?: StationInfo;
  to?: StationInfo;
  display_informations?: DisplayInfo;
}

export interface StationInfo {
  id: string;
  name: string;
}

export interface DisplayInfo {
  network: string;
  mode: string;
  direction: string;
  commercial_mode: string;

  // Champs réellement renvoyés par Navitia (optionnels)
  line?: string;
  label?: string;
  code?: string;
  name?: string;
  color?: string;
  text_color?: string;
  physical_mode?: string;
  company?: string;
}

export interface Journey {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  sections: Section[];
}
