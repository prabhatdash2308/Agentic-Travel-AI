export interface Trip {
  id: string;
  destination: string;
  date: string;
  budget: string;
  status: "completed" | "draft";
}

export const MOCK_TRIPS: Trip[] = [
  { id: "1", destination: "Japan - Tokyo & Kyoto", date: "2024-03-15", budget: "₹1,50,000", status: "completed" },
  { id: "2", destination: "Goa Weekend", date: "2024-02-20", budget: "₹25,000", status: "completed" },
  { id: "3", destination: "Europe Backpacking", date: "2024-06-01", budget: "₹3,00,000", status: "draft" },
];
