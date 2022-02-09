// data {currency: '', amount: ''}
export const currencyFormatter = ({ currency, amount }) => {
  return ((amount * 100) / 100).toLocaleString(currency, {
    style: "currency",
    currency,
  });
};

export const stripeCurrencyFormatter = ({ currency, amount }) => {
  return (amount / 100).toLocaleString(currency, {
    style: "currency",
    currency,
  });
};
