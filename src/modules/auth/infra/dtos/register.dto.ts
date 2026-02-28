import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/modules/user/domain/enums/user-role.enum';

export class RegisterCompanyProfileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the company',
    example: 'Company Name',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The logo URL of the company',
    example: 'https://example.com/logo.png',
  })
  logoUrl?: string;
}

export class RegisterCandidateProfileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The first name of the candidate',
    example: 'John',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The last name of the candidate',
    example: 'Doe',
  })
  lastName: string;
}

export enum RegisterRole {
  CANDIDATE = 'CANDIDATE',
  COMPANY = 'COMPANY',
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  @ApiProperty({
    description: 'The password of the user',
    example: 'Password@123',
  })
  password: string;

  @IsEnum(RegisterRole)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The role of the user',
    enum: RegisterRole,
  })
  role: UserRole;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'The company profile of the user',
    type: RegisterCompanyProfileDto,
  })
  companyProfile?: RegisterCompanyProfileDto;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'The candidate profile of the user',
    type: RegisterCandidateProfileDto,
  })
  candidateProfile?: RegisterCandidateProfileDto;
}
