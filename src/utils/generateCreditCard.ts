interface CreditCardDetails {
  cardNumber: string;
  limit: number;
  expirationDate: string;
  cvv: string;
}

export default function generateCreditCard(accountNumber: string, limit: number, validForYears: number = 10): CreditCardDetails {
  const cardPrefix = '4';

  const uniqueAccountPart = accountNumber.replace(/[^0-9]/g, '').slice(0, 14);
  const completeAccountPart = uniqueAccountPart.padEnd(14, '0');

  const cardNumber = `${cardPrefix}${completeAccountPart}`;

  const cvv = (Math.floor(Math.random() * 900) + 100).toString();

  const currentDate = new Date();
  const expirationDate = new Date(currentDate.getFullYear() + validForYears, currentDate.getMonth(), 1).toISOString().slice(0, 7).replace('-', '/');

  return {
    cardNumber,
    limit,
    expirationDate,
    cvv,
  };
}
