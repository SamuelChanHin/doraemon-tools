import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movies } from 'db-schema';
import { Repository } from 'typeorm';
import { GetMovieDto } from './dto/get-movie.dto';

@Injectable()
export class DoraemonMovieService {
  page = 1;
  pageSize = 10;

  constructor(
    @InjectRepository(Movies) private movieRepository: Repository<Movies>,
  ) {}

  findAll(params: GetMovieDto) {
    const { pageSize, page, sort, order, ...where } = params;
    const query = this.movieRepository.createQueryBuilder('movies');

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
    const query = this.movieRepository.createQueryBuilder('tools').where(param);

    return query.getOne();
  }

  async findByRandom() {
    const data = await this.movieRepository.query(`
     SELECT 
        id AS id,
        publish_date AS "publishDate",
        description_jp AS "descriptionJp",
        description_tc AS "descriptionTc",
        image_url AS "imageUrl", 
        name_jp AS "nameJp",
        name_tc AS "nameTc",
        status AS "status",
        created_at AS "createdAt",
        updated_at AS "updatedAt",
        deleted_at AS "deletedAt" 
      FROM movies
      ORDER BY random()
      LIMIT 1;
    `);

    return data?.[0];
  }

  insert(data: Partial<Movies> | Partial<Movies>[]) {
    return this.movieRepository
      .createQueryBuilder('movies')
      .insert()
      .values(data)
      .orIgnore(true)
      .execute();
  }

  count() {
    return this.movieRepository.createQueryBuilder('movies').getCount();
  }

  truncate() {
    return this.movieRepository.query(`TRUNCATE TABLE movies`);
  }
}
