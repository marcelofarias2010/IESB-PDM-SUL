/**
 * Converte o valor de data vindo do Firestore em um objeto Date.
 */
export function toDate(value) {
  if (value?.toDate) {
    return value.toDate();
  }

  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

/**
 * Converte um documento do Firestore no formato usado pelas telas.
 */
export function mapExpenseDocument(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    description: data.description ?? '',
    amount: Number(data.amount ?? 0),
    date: toDate(data.date),
    category: data.category ?? '',
  };
}
