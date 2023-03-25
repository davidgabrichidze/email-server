import { ApiProperty } from '@nestjs/swagger';

export class EmailsFindDto {
  /**
   * Location of the email
   *
   * @example 'inbox'
   */
  @ApiProperty()
  location?: string;
  query?: string;
  skip?: number;
  take?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
