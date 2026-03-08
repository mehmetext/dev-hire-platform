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
import { RequireCompanyOrCandidateProfileGuard } from 'src/shared/guards/require-company-or-candidate-profile.guard';
import { RequireCompanyProfileGuard } from 'src/shared/guards/require-company-profile.guard';
import { GetJobsCommand } from '../../application/dtos/get-jobs.command';
import { ApplyJobUseCase } from '../../application/use-cases/apply-job.use-case';
import { BulkAddJobQuestionsUseCase } from '../../application/use-cases/bulk-add-job-questions.use-case';
import { BulkDeleteJobQuestionsUseCase } from '../../application/use-cases/bulk-delete-job-questions.use-case';
import { BulkUpdateJobQuestionsUseCase } from '../../application/use-cases/bulk-update-job-questions.use-case';
import { CreateJobUseCase } from '../../application/use-cases/create-job.use-case';
import { DeleteJobUseCase } from '../../application/use-cases/delete-job.use-case';
import { GetApplicationDetailsByIdUseCase } from '../../application/use-cases/get-application-details-by-id.use-case';
import { GetJobApplicationsByJobIdUseCase } from '../../application/use-cases/get-job-applications-by-job-id-use-case';
import { GetJobDetailsByIdUseCase } from '../../application/use-cases/get-job-details-by-id.use-case';
import { GetJobQuestionsByJobIdUseCase } from '../../application/use-cases/get-job-questions-by-job-id.use-case';
import { GetJobsUseCase } from '../../application/use-cases/get-jobs.use-case';
import { GetOwnedJobApplicationsUseCase } from '../../application/use-cases/get-owned-job-applications.use-case';
import { GetOwnedJobsUseCase } from '../../application/use-cases/get-owned-jobs.use-case';
import { UpdateJobApplicationStatusByCompanyUseCase } from '../../application/use-cases/update-job-application-status-by-company.use-case';
import { UpdateJobUseCase } from '../../application/use-cases/update-job.use-case';
import { WithdrawJobUseCase } from '../../application/use-cases/withdraw-job.use-case';
import { ApplyJobDto } from '../dtos/apply-job.dto';
import { BulkAddJobQuestionsDto } from '../dtos/bulk-add-job-questions.dto';
import { BulkDeleteJobQuestionsDto } from '../dtos/bulk-delete-job-questions.dto';
import { BulkUpdateJobQuestionsDto } from '../dtos/bulk-update-job-questions.dto';
import { CreateJobDto } from '../dtos/create-job.dto';
import { GetJobsQueryDto } from '../dtos/get-jobs-query.dto';
import { JobApplicationDetailsResponseDto } from '../dtos/job-application-details-response.dto';
import {
  JobApplicationResponseWithoutCandidateDto,
  JobApplicationResponseWithoutJobDto,
} from '../dtos/job-application-response.dto';
import { JobQuestionResponseDto } from '../dtos/job-question-response.dto';
import {
  JobResponseDto,
  JobResponseWithoutCompanyDto,
} from '../dtos/job-response.dto';
import { UpdateJobApplicationStatusByCompanyDto } from '../dtos/update-job-application-status-by-company.dto';
import { UpdateJobDto } from '../dtos/update-job.dto';
import { JobApplicationDetailsMapper } from '../mappers/job-application-details.mapper';
import { JobsLimitGuard } from '../guards/jobs-limit.guard';

@Controller('jobs')
export class JobController {
  constructor(
    @Inject(CreateJobUseCase)
    private readonly createJobUseCase: CreateJobUseCase,
    @Inject(GetJobDetailsByIdUseCase)
    private readonly getJobDetailsByIdUseCase: GetJobDetailsByIdUseCase,
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
    @Inject(GetApplicationDetailsByIdUseCase)
    private readonly getApplicationDetailsByIdUseCase: GetApplicationDetailsByIdUseCase,
    @Inject(GetJobApplicationsByJobIdUseCase)
    private readonly getJobApplicationsByJobIdUseCase: GetJobApplicationsByJobIdUseCase,
    @Inject(UpdateJobApplicationStatusByCompanyUseCase)
    private readonly updateJobApplicationStatusByCompanyUseCase: UpdateJobApplicationStatusByCompanyUseCase,
    @Inject(GetOwnedJobApplicationsUseCase)
    private readonly getOwnedJobApplicationsUseCase: GetOwnedJobApplicationsUseCase,
    @Inject(BulkAddJobQuestionsUseCase)
    private readonly bulkAddJobQuestionsUseCase: BulkAddJobQuestionsUseCase,
    @Inject(BulkUpdateJobQuestionsUseCase)
    private readonly bulkUpdateJobQuestionsUseCase: BulkUpdateJobQuestionsUseCase,
    @Inject(BulkDeleteJobQuestionsUseCase)
    private readonly bulkDeleteJobQuestionsUseCase: BulkDeleteJobQuestionsUseCase,
    @Inject(GetJobQuestionsByJobIdUseCase)
    private readonly getJobQuestionsByJobIdUseCase: GetJobQuestionsByJobIdUseCase,
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
      jobQuestionAnswers: applyJobDto.jobQuestionAnswers,
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
    return this.getJobDetailsByIdUseCase.execute(id);
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

  @Get(':id/questions')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RequireCompanyProfileGuard)
  @ApiOkResponseGeneric(JobQuestionResponseDto, { isArray: true })
  async getJobQuestions(
    @Param('id') id: string,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    const questions = await this.getJobQuestionsByJobIdUseCase.execute(
      id,
      req.user.companyProfile!.id,
    );
    return questions.map((q) => ({
      id: q.id,
      question: q.question,
      questionType: q.questionType,
      isRequired: q.isRequired,
      sortOrder: q.sortOrder,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
      deletedAt: q.deletedAt,
    }));
  }

  @Post(':id/questions')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RequireCompanyProfileGuard)
  @ApiCreatedResponseGeneric(JobQuestionResponseDto, { isArray: true })
  async bulkAddJobQuestions(
    @Param('id') id: string,
    @Body() dto: BulkAddJobQuestionsDto,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    const questions = await this.bulkAddJobQuestionsUseCase.execute({
      jobId: id,
      companyProfileId: req.user.companyProfile!.id,
      questions: dto.questions.map((q) => ({
        question: q.question,
        questionType: q.questionType,
        isRequired: q.isRequired,
        sortOrder: q.sortOrder,
      })),
    });
    return questions.map((q) => ({
      id: q.id,
      question: q.question,
      questionType: q.questionType,
      isRequired: q.isRequired,
      sortOrder: q.sortOrder,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
      deletedAt: q.deletedAt,
    }));
  }

  @Put(':id/questions')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RequireCompanyProfileGuard)
  @ApiOkResponseGeneric(JobQuestionResponseDto, { isArray: true })
  async bulkUpdateJobQuestions(
    @Param('id') id: string,
    @Body() dto: BulkUpdateJobQuestionsDto,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    const questions = await this.bulkUpdateJobQuestionsUseCase.execute({
      jobId: id,
      companyProfileId: req.user.companyProfile!.id,
      questions: dto.questions.map((q) => ({
        id: q.id,
        question: q.question,
        questionType: q.questionType,
        isRequired: q.isRequired,
        sortOrder: q.sortOrder,
      })),
    });
    return questions.map((q) => ({
      id: q.id,
      question: q.question,
      questionType: q.questionType,
      isRequired: q.isRequired,
      sortOrder: q.sortOrder,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
      deletedAt: q.deletedAt,
    }));
  }

  @Delete(':id/questions')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RequireCompanyProfileGuard)
  @ApiNoContentResponse()
  bulkDeleteJobQuestions(
    @Param('id') id: string,
    @Body() dto: BulkDeleteJobQuestionsDto,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    return this.bulkDeleteJobQuestionsUseCase.execute({
      jobId: id,
      companyProfileId: req.user.companyProfile!.id,
      questionIds: dto.questionIds,
    });
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

  @Put('applications/:applicationId/status')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RequireCompanyProfileGuard)
  @ApiNoContentResponse()
  updateJobApplicationStatusByCompany(
    @Param('applicationId') applicationId: string,
    @Body()
    updateJobApplicationStatusByCompanyDto: UpdateJobApplicationStatusByCompanyDto,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    return this.updateJobApplicationStatusByCompanyUseCase.execute({
      applicationId,
      companyProfileId: req.user.companyProfile!.id,
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

  @Get('applications/:applicationId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RequireCompanyOrCandidateProfileGuard)
  @ApiOkResponseGeneric(JobApplicationDetailsResponseDto)
  async getApplicationDetailsById(
    @Param('applicationId') applicationId: string,
    @Req() req: Request & { user: UserResponseDto },
  ): Promise<JobApplicationDetailsResponseDto> {
    const result = await this.getApplicationDetailsByIdUseCase.execute({
      applicationId,
      companyProfileId: req.user.companyProfile?.id,
      candidateProfileId: req.user.candidateProfile?.id,
    });
    return JobApplicationDetailsMapper.toResponseDto(result);
  }
}
