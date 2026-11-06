export function formatPrice(price) {
  if (price == null) return '-';
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
}

// Boş bırakılırsa null döner; 0 geçerli bir değerdir (zemin kat gibi).
export function parseIntOrNull(value) {
  if (value === '' || value == null) return null;
  const sayi = parseInt(value, 10);
  return Number.isNaN(sayi) ? null : sayi;
}

export function parseFloatOrNull(value) {
  if (value === '' || value == null) return null;
  const sayi = parseFloat(value);
  return Number.isNaN(sayi) ? null : sayi;
}
