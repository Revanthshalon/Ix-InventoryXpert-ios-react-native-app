export function sortByProperty<T>(
  data: T[],
  propertyName: keyof T,
  ascending = true
): T[] {
  return data.slice().sort((a, b) => {
    const aValue = a[propertyName];
    const bValue = b[propertyName];

    if (ascending) {
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
    } else {
      if (aValue > bValue) return -1;
      if (aValue < bValue) return 1;
    }

    return 0; // Equal values
  });
}
