import { Injectable } from '@nestjs/common';
import { AdminCategoryRepo, AdminSubcategoryRepo } from '../repo/category.repo';
import {
  CreateCategoryDto,
  CreateSubcategoryDto,
  UpdateCategoryDto,
  UpdateSubcategoryDto,
} from 'src/domain/admin/dto/category-admin.dto';
import { isEmpty } from 'lodash';
import { CategoryNotFoundException } from 'src/errors/permission.error';
import { ListPageDto } from 'src/shared/dto/list.dto';

@Injectable()
export class AdminCategoryService {
  constructor(
    private readonly adminCategoryRepo: AdminCategoryRepo,
    private readonly adminSubcategoryRepo: AdminSubcategoryRepo,
  ) { }

  create(params: CreateCategoryDto) {
    return this.adminCategoryRepo.insert({
      name_uz: params.name_uz,
      name_ru: params.name_ru,
      name_en: params.name_en,
      original_image: params.original_image,
      avif_image: params.avif_image,
      small_image: params.small_image,
    });
  }

  createSubcategory(params: CreateSubcategoryDto) {
    return this.adminSubcategoryRepo.insert({
      name_uz: params.name_uz,
      name_ru: params.name_ru,
      name_en: params.name_en,
      original_image: params.original_image,
      avif_image: params.avif_image,
      small_image: params.small_image,
      category_id: params.category_id,
    });
  }

  async update(params: UpdateCategoryDto) {
    const category = await this.adminCategoryRepo.selectById(params.id);

    if (isEmpty(category)) {
      throw new CategoryNotFoundException();
    }

    return this.adminCategoryRepo.updateById(params.id, {
      name_uz: params?.name_uz,
      name_ru: params?.name_ru,
      name_en: params?.name_en,
      original_image: params?.original_image,
      avif_image: params?.avif_image,
      small_image: params?.small_image,
    });
  }

  async updateSubcategory(params: UpdateSubcategoryDto) {
    const category = await this.adminSubcategoryRepo.selectById(params.id);

    if (isEmpty(category)) {
      throw new CategoryNotFoundException();
    }

    return this.adminSubcategoryRepo.updateById(params.id, {
      name_uz: params?.name_uz,
      name_ru: params?.name_ru,
      name_en: params?.name_en,
      original_image: params?.original_image,
      avif_image: params?.avif_image,
      small_image: params?.small_image,
      cateory_id: params?.category_id,
    });
  }

  async delete(id: string) {
    const category = await this.adminCategoryRepo.selectById(id);

    if (isEmpty(category)) {
      throw new CategoryNotFoundException();
    }

    return this.adminCategoryRepo.softDelete(id);
  }

  async deleteSubcategory(id: string) {
    const category = await this.adminSubcategoryRepo.selectById(id);

    if (isEmpty(category)) {
      throw new CategoryNotFoundException();
    }

    return this.adminSubcategoryRepo.softDelete(id);
  }

  async getAllCategories(params: ListPageDto) {
    return this.adminCategoryRepo.paginatedSelect(
      this.adminCategoryRepo._tableName,
      ['*'],
      params?.page,
      params?.per_page,
    );
  }

  async getAllSubCategories(params: ListPageDto) {
    return this.adminSubcategoryRepo.paginatedSelect(
      this.adminSubcategoryRepo._tableName,
      ['*'],
      params?.page,
      params?.per_page,
    );
  }
}
