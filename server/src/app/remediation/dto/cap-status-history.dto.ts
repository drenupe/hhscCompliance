export class CapStatusHistoryDto {
  id!: string;

  capId!: string;

  fromStatus!: string | null;

  toStatus!: string;

  note!: string | null;

  changedByUserId!: string | null;

  createdAt!: Date;
}