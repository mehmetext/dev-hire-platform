import { ApiProperty } from '@nestjs/swagger';

export class CandidateCvResponseDto {
  @ApiProperty({
    description: 'The ID of the candidate CV',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The title of the candidate CV',
    example: 'Software Engineer',
  })
  title: string | undefined;

  @ApiProperty({
    description: 'The URL of the candidate CV',
    example: 'https://example.com/cv.pdf',
  })
  url: string;

  @ApiProperty({
    description: 'The created at date of the candidate CV',
    example: new Date().toISOString(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at date of the candidate CV',
    example: new Date().toISOString(),
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The deleted at date of the candidate CV (optional)',
    example: new Date().toISOString(),
    nullable: true,
  })
  deletedAt?: Date | null;
}
