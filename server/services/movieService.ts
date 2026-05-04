import { getDataSource } from "../database/data-source";
import { Movies } from "../database/entity/movie";

export async function findMovies(params: { page?: number; pageSize?: number }) {
  const ds = await getDataSource();
  const repo = ds.getRepository(Movies);
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const [items] = await repo.findAndCount({
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  return items;
}

export async function countMovies() {
  const ds = await getDataSource();
  const repo = ds.getRepository(Movies);
  return await repo.count();
}

export async function randomMovie() {
  const ds = await getDataSource();
  const repo = ds.getRepository(Movies);
  const total = await repo.count();
  const rand = Math.floor(Math.random() * Math.max(1, total));
  const items = await repo.find({ skip: rand, take: 1 });
  return items[0] || null;
}

export async function truncateMovies() {
  const ds = await getDataSource();
  const repo = ds.getRepository(Movies);
  await repo.clear();
}

export async function insertMovies(items: Movies[]) {
  if (!items || !items.length) return;
  const ds = await getDataSource();
  const repo = ds.getRepository(Movies);
  await repo.save(items);
}

export async function scrapeMoviesFromSource(page = 1) {
  const { DoraemonScrapService } = await import('./scrapService');
  return await DoraemonScrapService.scrapeMovies(page);
}
