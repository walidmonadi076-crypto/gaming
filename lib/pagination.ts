export function paginate<T>(items: T[], page: number, itemsPerPage: number = 20) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    items: items.slice(startIndex, endIndex),
    totalPages: Math.ceil(items.length / itemsPerPage),
    currentPage: page,
    totalItems: items.length,
    itemsPerPage,
    hasNextPage: endIndex < items.length,
    hasPreviousPage: page > 1,
  };
}
