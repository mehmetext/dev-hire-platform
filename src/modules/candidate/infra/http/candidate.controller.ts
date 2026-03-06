import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiNoContentResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user-response.dto';
import { ApiCreatedResponseGeneric } from 'src/shared/decorators/api-created-response-generic.decorator';
import { ApiOkResponseGeneric } from 'src/shared/decorators/api-ok-response-generic.decorator';
import { UpdateCandidateProfileCommand } from '../../application/dtos/update-candidate-profile.command';
import { CreateCandidateCvUseCase } from '../../application/use-cases/create-candidate-cv.use-case';
import { DeleteCandidateCvUseCase } from '../../application/use-cases/delete-candidate-cv.use-case';
import { GetCvsByCandidateIdUseCase } from '../../application/use-cases/get-cvs-by-candidate-id.use-case';
import { UpdateCandidateCvUseCase } from '../../application/use-cases/update-candidate-cv.use-case';
import { UpdateCandidateProfileUseCase } from '../../application/use-cases/update-candidate-profile.use-case';
import {
  CandidateProfileNotAllowedError,
  CandidateProfileNotFoundError,
} from '../../domain/errors';
import { CandidateCvResponseDto } from '../dtos/candidate-cv-resposne.dto';
import { CandidateResponseDto } from '../dtos/candidate-response.dto';
import { CreateCandidateCvDto } from '../dtos/create-candidate-cv.dto';
import { UpdateCandidateCvDto } from '../dtos/update-candidate-cv.dto';
import { UpdateCandidateProfileDto } from '../dtos/update-candidate-profile.dto';

@Controller('candidate')
export class CandidateController {
  constructor(
    @Inject(GetCvsByCandidateIdUseCase)
    private readonly getCvsByCandidateIdUseCase: GetCvsByCandidateIdUseCase,
    @Inject(CreateCandidateCvUseCase)
    private readonly createCandidateCvUseCase: CreateCandidateCvUseCase,
    @Inject(UpdateCandidateCvUseCase)
    private readonly updateCandidateCvUseCase: UpdateCandidateCvUseCase,
    @Inject(DeleteCandidateCvUseCase)
    private readonly deleteCandidateCvUseCase: DeleteCandidateCvUseCase,
    @Inject(UpdateCandidateProfileUseCase)
    private readonly updateCandidateProfileUseCase: UpdateCandidateProfileUseCase,
  ) {}

  @Patch('profile/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponseGeneric(CandidateResponseDto)
  async updateProfile(
    @Param('id') id: string,
    @Body() updateCandidateProfileDto: UpdateCandidateProfileDto,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    if (!req.user.candidateProfile?.id) {
      throw new CandidateProfileNotFoundError();
    }

    if (req.user.candidateProfile.id !== id) {
      throw new CandidateProfileNotAllowedError();
    }

    return this.updateCandidateProfileUseCase.execute(
      new UpdateCandidateProfileCommand(
        id,
        req.user.id,
        updateCandidateProfileDto.firstName,
        updateCandidateProfileDto.lastName,
      ),
    );
  }

  @Get('cvs')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponseGeneric(CandidateCvResponseDto, { isArray: true })
  async getCvsByCandidateId(@Req() req: Request & { user: UserResponseDto }) {
    if (!req.user.candidateProfile?.id) {
      throw new UnauthorizedException('Candidate profile not found');
    }

    return this.getCvsByCandidateIdUseCase.execute(
      req.user.candidateProfile.id,
    );
  }

  @Post('cvs')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponseGeneric(CandidateCvResponseDto)
  async createCv(
    @Body() createCandidateCvDto: CreateCandidateCvDto,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    if (!req.user.candidateProfile?.id) {
      throw new UnauthorizedException('Candidate profile not found');
    }

    return this.createCandidateCvUseCase.execute({
      candidateProfileId: req.user.candidateProfile.id,
      title: createCandidateCvDto.title,
      url: createCandidateCvDto.url,
    });
  }

  @Put('cvs/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponseGeneric(CandidateCvResponseDto)
  async updateCv(
    @Param('id') id: string,
    @Body() updateCandidateCvDto: UpdateCandidateCvDto,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    if (!req.user.candidateProfile?.id) {
      throw new UnauthorizedException('Candidate profile not found');
    }

    return this.updateCandidateCvUseCase.execute({
      id,
      candidateProfileId: req.user.candidateProfile.id,
      title: updateCandidateCvDto.title,
      url: updateCandidateCvDto.url,
    });
  }

  @Delete('cvs/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiNoContentResponse()
  async deleteCv(
    @Param('id') id: string,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    if (!req.user.candidateProfile?.id) {
      throw new UnauthorizedException('Candidate profile not found');
    }

    await this.deleteCandidateCvUseCase.execute({
      id,
      candidateProfileId: req.user.candidateProfile.id,
    });
  }
}
