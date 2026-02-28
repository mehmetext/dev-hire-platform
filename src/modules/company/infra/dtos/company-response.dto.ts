import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionPlan } from 'src/modules/company/domain/enums/subscription-plan.enum';

export class CompanyResponseDto {
  @ApiProperty({
    description: 'The ID of the company',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the company',
    example: 'Company Name',
  })
  name: string;

  @ApiProperty({
    description: 'The logo URL of the company',
    example: 'https://example.com/logo.png',
  })
  logoUrl: string | undefined;

  @ApiProperty({
    description: 'The subscription plan of the company',
    example: SubscriptionPlan.FREE,
  })
  subscriptionPlan: SubscriptionPlan;

  @ApiProperty({
    description: 'The created at date of the company',
    example: new Date().toISOString(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at date of the company',
    example: new Date().toISOString(),
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The deleted at date of the company (optional)',
    example: new Date().toISOString(),
    nullable: true,
  })
  deletedAt?: Date | null;
}
