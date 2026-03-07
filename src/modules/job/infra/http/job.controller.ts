import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiNoContentResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user-response.dto';
import { ApiCreatedResponseGeneric } from 'src/shared/decorators/api-created-response-generic.decorator';
import { ApiOkResponseGeneric } from 'src/shared/decorators/api-ok-response-generic.decorator';
import { RequireCandidateProfileGuard } from 'src/shared/guards/require-candidate-profile.guard';
import { RequireCompanyProfileGuard } from 'src/shared/guards/require-company-profile.guard';
import { GetJobsCommand } from '../../application/dtos/get-jobs.command';
import { ApplyJobUseCase } from '../../application/use-cases/apply-job.use-case';
import { CreateJobUseCase } from '../../application/use-cases/create-job.use-case';
import { DeleteJobUseCase } from '../../application/use-cases/delete-job.use-case';
import { GetJobApplicationsByJobIdUseCase } from '../../application/use-cases/get-job-applications-by-job-id-use-case';
import { GetJobByIdUseCase } from '../../application/use-cases/get-job-by-id.use-case';
import { GetJobsUseCase } from '../../application/use-cases/get-jobs.use-case';
import { GetOwnedJobApplicationsUseCase } from '../../application/use-cases/get-owned-job-applications.use-case';
import { GetOwnedJobsUseCase } from '../../application/use-cases/get-owned-jobs.use-case';
import { UpdateJobApplicationStatusByCompanyUseCase } from '../../application/use-cases/update-job-application-status-by-company.use-case';
import { UpdateJobUseCase } from '../../application/use-cases/update-job.use-case';
import { WithdrawJobUseCase } from '../../application/use-cases/withdraw-job.use-case';
import { ApplyJobDto } from '../dtos/apply-job.dto';
import { CreateJobDto } from '../dtos/create-job.dto';
import { GetJobsQueryDto } from '../dtos/get-jobs-query.dto';
import {
  JobApplicationResponseWithoutCandidateDto,
  JobApplicationResponseWithoutJobDto,
} from '../dtos/job-application-response.dto';
import {
  JobResponseDto,
  JobResponseWithoutCompanyDto,
} from '../dtos/job-response.dto';
import { UpdateJobApplicationStatusByCompanyDto } from '../dtos/update-job-application-status-by-company.dto';
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
    @Inject(UpdateJobApplicationStatusByCompanyUseCase)
    private readonly updateJobApplicationStatusByCompanyUseCase: UpdateJobApplicationStatusByCompanyUseCase,
    @Inject(GetOwnedJobApplicationsUseCase)
    private readonly getOwnedJobApplicationsUseCase: GetOwnedJobApplicationsUseCase,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RequireCompanyProfileGuard, JobsLimitGuard)
  @ApiCreatedResponseGeneric(JobResponseDto)
  async createJob(
    @Body() createJobDto: CreateJobDto,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    return this.createJobUseCase.execute({
      ...createJobDto,
      companyProfileId: req.user.companyProfile!.id,
    });
  }

  @Post(':id/apply')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RequireCandidateProfileGuard)
  @ApiNoContentResponse()
  async applyJob(
    @Param('id') id: string,
    @Body() applyJobDto: ApplyJobDto,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    return this.applyJobUseCase.execute({
      jobId: id,
      candidateProfileId: req.user.candidateProfile!.id,
      candidateCVId: applyJobDto.candidateCVId,
    });
  }

  @Delete(':id/withdraw')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RequireCandidateProfileGuard)
  @ApiNoContentResponse()
  async withdrawJob(
    @Param('id') id: string,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    return this.withdrawJobUseCase.execute({
      jobId: id,
      candidateProfileId: req.user.candidateProfile!.id,
    });
  }

  @Get('owned')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RequireCompanyProfileGuard)
  @ApiOkResponseGeneric(JobResponseWithoutCompanyDto, {
    isArray: true,
  })
  getOwnedJobs(@Req() req: Request & { user: UserResponseDto }) {
    return this.getOwnedJobsUseCase.execute(req.user.companyProfile!.id);
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
  getJobs(@Query() getJobsQueryDto: GetJobsQueryDto) {
    return this.getJobsUseCase.execute(
      new GetJobsCommand(getJobsQueryDto.query, getJobsQueryDto.workType),
    );
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RequireCompanyProfileGuard)
  @ApiOkResponseGeneric(JobResponseDto)
  updateJob(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    return this.updateJobUseCase.execute({
      id,
      companyProfileId: req.user.companyProfile!.id,
      ...updateJobDto,
    });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RequireCompanyProfileGuard)
  @ApiNoContentResponse()
  deleteJob(
    @Param('id') id: string,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    return this.deleteJobUseCase.execute(id, req.user.companyProfile!.id);
  }

  @Get(':id/applications')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RequireCompanyProfileGuard)
  @ApiOkResponseGeneric(JobApplicationResponseWithoutJobDto, {
    isArray: true,
  })
  getJobApplicationsByJobId(
    @Param('id') id: string,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    return this.getJobApplicationsByJobIdUseCase.execute({
      jobId: id,
      companyProfileId: req.user.companyProfile!.id,
    });
  }

  @Put(':jobId/applications/:candidateProfileId/status')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RequireCompanyProfileGuard)
  @ApiNoContentResponse()
  updateJobApplicationStatusByCompany(
    @Param('jobId') jobId: string,
    @Param('candidateProfileId') candidateProfileId: string,
    @Body()
    updateJobApplicationStatusByCompanyDto: UpdateJobApplicationStatusByCompanyDto,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    return this.updateJobApplicationStatusByCompanyUseCase.execute({
      jobId,
      companyProfileId: req.user.companyProfile!.id,
      candidateProfileId,
      status: updateJobApplicationStatusByCompanyDto.status,
    });
  }

  @Get('applications/owned')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RequireCandidateProfileGuard)
  @ApiOkResponseGeneric(JobApplicationResponseWithoutCandidateDto, {
    isArray: true,
  })
  getOwnedJobApplications(@Req() req: Request & { user: UserResponseDto }) {
    return this.getOwnedJobApplicationsUseCase.execute({
      candidateProfileId: req.user.candidateProfile!.id,
    });
  }
}
