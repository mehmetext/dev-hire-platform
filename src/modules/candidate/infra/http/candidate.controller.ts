import {
  Controller,
  Get,
  Inject,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user-response.dto';
import { ApiOkResponseGeneric } from 'src/shared/decorators/api-ok-response-generic.decorator';
import { GetCvsByCandidateIdUseCase } from '../../application/use-cases/get-cvs-by-candidate-id.use-case';
import { CandidateCvResponseDto } from '../dtos/candidate-cv-resposne.dto';

@Controller('candidate')
export class CandidateController {
  constructor(
    @Inject(GetCvsByCandidateIdUseCase)
    private readonly getCvsByCandidateIdUseCase: GetCvsByCandidateIdUseCase,
  ) {}

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
}
