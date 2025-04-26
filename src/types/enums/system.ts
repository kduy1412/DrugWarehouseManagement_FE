export enum SystemCategoryConfigEnum {
  ReportId = 100,
  MedicineId = 200,
  MedicalEquipmentId = 300,
  BeautyId = 400,
  MomToolId = 500,
  OtherId = 600,
  SKUId = 700,
}

export enum InValidSystemCategoryConfigEnum {
  SKUId = SystemCategoryConfigEnum.SKUId,
  ReportId = SystemCategoryConfigEnum.ReportId,
  OtherId = SystemCategoryConfigEnum.OtherId,
}

export enum SystemWarehouseConfigEnum {
  CancelWarehouse = 2,
  ReturnedWarehouse = 6,
}

export const SystemCategoryConfigList: number[] = Object.keys(
  InValidSystemCategoryConfigEnum
)
  .filter((item) => !isNaN(Number(item)))
  .map((item) => Number(item));
