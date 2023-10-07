export const pageInfo = (offset: number, limit: number, totalCount: number) => ({
  hasNextPage: offset === 0 && limit === 0 ? false : totalCount > offset + limit,
  hasPreviousPage: offset !== 0,
});
