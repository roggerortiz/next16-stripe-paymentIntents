import 'server-only';

export async function calculateOrder() {
  // Look up prices on the server. Never trust an amount supplied by the client.
  const items = [{ id: 'xl-tshirt', amount: 1400 }];
  const subtotal = items.reduce((total, item) => total + item.amount, 0);
  const currency = 'usd';

  return { amount: subtotal, currency };
}