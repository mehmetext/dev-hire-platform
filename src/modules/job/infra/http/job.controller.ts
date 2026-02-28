import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user-response.dto';
import { CreateJobUseCase } from '../../application/use-cases/create-job.use-case';
import { CreateJobDto } from '../dtos/create-job.dto';

@Controller('jobs')
export class JobController {
  constructor(
    @Inject(CreateJobUseCase)
    private readonly createJobUseCase: CreateJobUseCase,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async createJob(
    @Body() createJobDto: CreateJobDto,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    if (!req.user.companyProfile?.id) {
      throw new UnauthorizedException('Company profile not found');
    }

    return this.createJobUseCase.execute({
      ...createJobDto,
      companyProfileId: req.user.companyProfile.id,
    });
  }
}
