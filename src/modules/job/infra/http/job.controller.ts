import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user-response.dto';
import { ApiCreatedResponseGeneric } from 'src/shared/decorators/api-created-response-generic.decorator';
import { ApiOkResponseGeneric } from 'src/shared/decorators/api-ok-response-generic.decorator';
import { CreateJobUseCase } from '../../application/use-cases/create-job.use-case';
import { GetJobByIdUseCase } from '../../application/use-cases/get-job-by-id.use-case';
import { GetJobsUseCase } from '../../application/use-cases/get-jobs.use-case';
import { CreateJobDto } from '../dtos/create-job.dto';
import { JobResponseDto } from '../dtos/job-response.dto';

@Controller('jobs')
export class JobController {
  constructor(
    @Inject(CreateJobUseCase)
    private readonly createJobUseCase: CreateJobUseCase,
    @Inject(GetJobByIdUseCase)
    private readonly getJobByIdUseCase: GetJobByIdUseCase,
    @Inject(GetJobsUseCase)
    private readonly getJobsUseCase: GetJobsUseCase,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponseGeneric(JobResponseDto)
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

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponseGeneric(JobResponseDto)
  getJobById(@Param('id') id: string) {
    return this.getJobByIdUseCase.execute(id);
  }

  @Get()
  @ApiOkResponseGeneric(JobResponseDto, { isArray: true })
  getJobs() {
    return this.getJobsUseCase.execute();
  }
}
