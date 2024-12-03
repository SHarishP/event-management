export interface ITransactions {
  id: number;
  seats: number;
  totalPrice: number;
  isPaid: boolean;
  event: {
    name: string;
    startDate: string;
    startTime: string;
    decription: string;
    location: {
      name: string;
    };
    category: {
      name: string;
    };
  };
}

export interface IPayment {
  id: number;
  amountPaid: number;
  paymentProof: string | null;
  isPaid: boolean;
  transactions: ITransaction[]; // Ensuring transactions is an array
}

export interface ITransaction {
  id: number;
  seats: number;
  totalPrice: number;
  event: {
    name: string;
    startDate: string;
    startTime: string;
    description: string;
    location: {
      name: string;
    };
    category: {
      name: string;
    };
  };
}
