export interface IMyEvents {
  name: string;
  location: {
    name: string;
  };
  totalSeats: number;
  remainSeats: number;
  transaction: {
    user: {
      name: string;
      email: string;
    };
    seats: number;
    isPaid: boolean;
  }[];
}
