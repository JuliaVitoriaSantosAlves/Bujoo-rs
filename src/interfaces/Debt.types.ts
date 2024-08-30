export interface Debt {
    id: string;
    amount: number;
    interestRate: number;
    dueDate: string;
    installments: number;
    paidInstallments: number;
    isPaid: boolean;
}