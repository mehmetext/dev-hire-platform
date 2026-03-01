import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiNoContentResponse, OmitType } from '@nestjs/swagger';
import { Request } from 'express';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user-response.dto';
import { ApiCreatedResponseGeneric } from 'src/shared/decorators/api-created-response-generic.decorator';
import { ApiOkResponseGeneric } from 'src/shared/decorators/api-ok-response-generic.decorator';
import { ApplyJobUseCase } from '../../application/use-cases/apply-job.use-case';
import { CreateJobUseCase } from '../../application/use-cases/create-job.use-case';
import { DeleteJobUseCase } from '../../application/use-cases/delete-job.use-case';
import { GetJobApplicationsByJobIdUseCase } from '../../application/use-cases/get-job-applications-by-job-id-use-case';
import { GetJobByIdUseCase } from '../../application/use-cases/get-job-by-id.use-case';
import { GetJobsUseCase } from '../../application/use-cases/get-jobs.use-case';
import { GetOwnedJobsUseCase } from '../../application/use-cases/get-owned-jobs.use-case';
import { UpdateJobUseCase } from '../../application/use-cases/update-job.use-case';
import { WithdrawJobUseCase } from '../../application/use-cases/withdraw-job.use-case';
import { ApplyJobDto } from '../dtos/apply-job.dto';
import { CreateJobDto } from '../dtos/create-job.dto';
import { JobApplicationResponseDto } from '../dtos/job-application-response.dto';
import { JobResponseDto } from '../dtos/job-response.dto';
import { UpdateJobDto } from '../dtos/update-job.dto';
import { JobsLimitGuard } from '../guards/jobs-limit.guard';

@Controller('jobs')
export class JobController {
  constructor(
    @Inject(CreateJobUseCase)
    private readonly createJobUseCase: CreateJobUseCase,
    @Inject(GetJobByIdUseCase)
    private readonly getJobByIdUseCase: GetJobByIdUseCase,
    @Inject(GetJobsUseCase)
    private readonly getJobsUseCase: GetJobsUseCase,
    @Inject(UpdateJobUseCase)
    private readonly updateJobUseCase: UpdateJobUseCase,
    @Inject(GetOwnedJobsUseCase)
    private readonly getOwnedJobsUseCase: GetOwnedJobsUseCase,
    @Inject(DeleteJobUseCase)
    private readonly deleteJobUseCase: DeleteJobUseCase,
    @Inject(ApplyJobUseCase)
    private readonly applyJobUseCase: ApplyJobUseCase,
    @Inject(WithdrawJobUseCase)
    private readonly withdrawJobUseCase: WithdrawJobUseCase,
    @Inject(GetJobApplicationsByJobIdUseCase)
    private readonly getJobApplicationsByJobIdUseCase: GetJobApplicationsByJobIdUseCase,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JobsLimitGuard)
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

  @Post(':id/apply')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiNoContentResponse()
  async applyJob(
    @Param('id') id: string,
    @Body() applyJobDto: ApplyJobDto,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    if (!req.user.candidateProfile?.id) {
      throw new UnauthorizedException('Candidate profile not found');
    }

    return this.applyJobUseCase.execute({
      jobId: id,
      candidateProfileId: req.user.candidateProfile.id,
      candidateCVId: applyJobDto.candidateCVId,
    });
  }

  @Delete(':id/withdraw')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiNoContentResponse()
  async withdrawJob(
    @Param('id') id: string,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    if (!req.user.candidateProfile?.id) {
      throw new UnauthorizedException('Candidate profile not found');
    }

    return this.withdrawJobUseCase.execute({
      jobId: id,
      candidateProfileId: req.user.candidateProfile.id,
    });
  }

  @Get('owned')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponseGeneric(OmitType(JobResponseDto, ['companyProfile']), {
    isArray: true,
  })
  getOwnedJobs(@Req() req: Request & { user: UserResponseDto }) {
    if (!req.user.companyProfile?.id) {
      throw new UnauthorizedException('Company profile not found');
    }

    return this.getOwnedJobsUseCase.execute(req.user.companyProfile.id);
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

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponseGeneric(JobResponseDto)
  updateJob(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    if (!req.user.companyProfile?.id) {
      throw new UnauthorizedException('Company profile not found');
    }

    return this.updateJobUseCase.execute({
      id,
      companyProfileId: req.user.companyProfile.id,
      ...updateJobDto,
    });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiNoContentResponse()
  deleteJob(
    @Param('id') id: string,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    if (!req.user.companyProfile?.id) {
      throw new UnauthorizedException('Company profile not found');
    }
    return this.deleteJobUseCase.execute(id, req.user.companyProfile.id);
  }

  @Get(':id/applications')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponseGeneric(JobApplicationResponseDto, { isArray: true })
  getJobApplicationsByJobId(@Param('id') id: string) {
    return this.getJobApplicationsByJobIdUseCase.execute(id);
  }
}
