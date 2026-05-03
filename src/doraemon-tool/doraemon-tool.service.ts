import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tools } from 'db-schema';
import { GetToolDto } from './dto/get-tool.dto';

@Injectable()
export class DoraemonToolService {
  page = 1;
  pageSize = 10;

  constructor(
    @InjectRepository(Tools) private toolRepository: Repository<Tools>,
  ) {}

  findAll(params: GetToolDto) {
    const { pageSize, page, sort, order, ...where } = params;
    const query = this.toolRepository.createQueryBuilder('tools');

    query.orderBy('id', 'ASC').skip((this.page - 1) * this.pageSize);

    if (pageSize > 0) {
      query.take(pageSize);
    } else if (pageSize !== 0) {
      query.take(this.pageSize);
    }

    if (page > 0) {
      query.skip((page - 1) * pageSize);
    }

    if (order && sort) {
      query.orderBy(sort, order);
    }

    if (where) {
      query.where(where);
    }

    return query.getMany();
  }

  findOne(param: Record<string, any>) {
    const query = this.toolRepository.createQueryBuilder('tools').where(param);

    return query.getOne();
  }

  async findByRandom() {
    const data = await this.toolRepository.query(`
     SELECT 
        id AS id,
        description_jp AS "descriptionJp",
        description_tc AS "descriptionTc",
        image_url AS "imageUrl", 
        name_jp AS "nameJp",
        name_tc AS "nameTc",
        status AS "status",
        created_at AS "createdAt",
        updated_at AS "updatedAt",
        deleted_at AS "deletedAt" 
      FROM tools
      ORDER BY random()
      LIMIT 1;
    `);

    return data?.[0];
  }

  insert(data: Partial<Tools>[]) {
    return this.toolRepository
      .createQueryBuilder('tools')
      .insert()
      .values(data)
      .orIgnore(true)
      .execute();
  }

  count() {
    return this.toolRepository.createQueryBuilder('tools').getCount();
  }

  truncate() {
    return this.toolRepository.query(`TRUNCATE TABLE tools`);
  }
}
