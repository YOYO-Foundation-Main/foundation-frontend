// ✅ Always use en-US locale explicitly — same on server and client
// Prevents React hydration mismatch from different locale formatting
export function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

export function formatCurrency(num: number): string {
  return `₹${num.toLocaleString("en-US")}`;
}