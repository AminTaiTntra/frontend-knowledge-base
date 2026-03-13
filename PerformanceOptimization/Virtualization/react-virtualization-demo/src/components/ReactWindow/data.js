export const data = Array.from({ length: 10000 }, (_, index) => ({
  id: index,
  name: `User ${index}`,
}));

export const dataForPagination = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `User ${i}`,
  email: `user${i}@mail.com`
}));