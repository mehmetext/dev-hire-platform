import { ApiProperty } from '@nestjs/swagger';

export class CandidateResponseDto {
  @ApiProperty({
    description: 'The ID of the candidate',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The first name of the candidate',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the candidate',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'The created at date of the candidate',
    example: new Date().toISOString(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at date of the candidate',
    example: new Date().toISOString(),
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The deleted at date of the candidate (optional)',
    example: new Date().toISOString(),
    nullable: true,
  })
  deletedAt?: Date | null;
}
