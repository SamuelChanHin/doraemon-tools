import { getDataSource } from "../database/data-source";
import { Tools } from "../database/entity/tools";

export async function findTools(params: { page?: number; pageSize?: number }) {
  const ds = await getDataSource();
  const repo = ds.getRepository(Tools);
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const [items] = await repo.findAndCount({
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  return items;
}

export async function countTools() {
  const ds = await getDataSource();
  console.log("Counting tools in database...");
  const repo = ds.getRepository(Tools);
  return await repo.count();
}

export async function randomTool() {
  const ds = await getDataSource();
  const repo = ds.getRepository(Tools);
  const total = await repo.count();
  const rand = Math.floor(Math.random() * Math.max(1, total));
  const items = await repo.find({ skip: rand, take: 1 });
  return items[0] || null;
}

export async function truncateTools() {
  const ds = await getDataSource();
  const repo = ds.getRepository(Tools);
  await repo.clear();
}

export async function insertTools(items: Tools[]) {
  if (!items || !items.length) return;
  const ds = await getDataSource();
  const repo = ds.getRepository(Tools);
  await repo.save(items);
}

export async function scrapeToolsFromSource(page = 1) {
  // Placeholder: implement scraping logic or call external scraper here.
  // Currently returns empty array to indicate no-op.
  return [];
}
