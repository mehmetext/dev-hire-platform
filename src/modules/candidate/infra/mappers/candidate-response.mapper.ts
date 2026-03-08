import { CandidateCV } from '../../domain/entities/candidate-cv.entity';
import { CandidateProfile } from '../../domain/entities/candidate-profile.entity';
import { CandidateCvResponseDto } from '../dtos/candidate-cv-resposne.dto';
import { CandidateResponseDto } from '../dtos/candidate-response.dto';

export class CandidateResponseMapper {
  static toProfileDto(profile: CandidateProfile): CandidateResponseDto {
    return {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      deletedAt: profile.deletedAt ?? undefined,
    };
  }

  static toCvDto(cv: CandidateCV): CandidateCvResponseDto {
    return {
      id: cv.id,
      title: cv.title,
      url: cv.url,
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt,
      deletedAt: cv.deletedAt ?? undefined,
    };
  }
}
