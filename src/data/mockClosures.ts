export interface Closure {
  id: string;
  roadName: string;
  type: string;
  status: string;
  lat: number;
  lng: number;
  description: string;
  reportedAt: string;
}

export const mockClosures: Closure[] = [
  {
    id: "1",
    roadName: "Ngunguru Road",
    type: "Slip",
    status: "Investigating",
    lat: -35.689,
    lng: 174.456,
    description: "Large slip blocking one lane near the golf course.",
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "2",
    roadName: "State Highway 1",
    type: "Flooding",
    status: "Closed",
    lat: -35.801,
    lng: 174.312,
    description: "Flooding across both lanes south of Oakleigh.",
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "3",
    roadName: "Riverside Drive",
    type: "Tree Down",
    status: "Clearing",
    lat: -35.728,
    lng: 174.335,
    description: "Tree blocking the footpath and cycleway.",
    reportedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "4",
    roadName: "Whareora Road",
    type: "Pothole",
    status: "Reported",
    lat: -35.705,
    lng: 174.360,
    description: "Deep pothole in the left lane heading east.",
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  }
];
