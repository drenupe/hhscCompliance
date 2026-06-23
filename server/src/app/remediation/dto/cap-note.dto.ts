export class CapNoteDto {
  id!: string;

  capId!: string;

  note!: string;

  createdByUserId!: string | null;

  createdAt!: Date;
}