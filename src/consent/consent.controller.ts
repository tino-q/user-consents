import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from '../../src/user/user.service';
import { CreateUserConsentChangedEventDto } from '../../src/user/user.dto';
import { ConsentService } from './consent.service';
import { User } from '../../src/user/user.entity';

@ApiTags('Events')
@Controller('events')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
})
export class ConsentController {
  constructor(
    private readonly consentService: ConsentService,
    private readonly userService: UserService,
  ) {}
  @Post()
  @ApiOperation({ summary: 'Send a user consent changed event' })
  @ApiCreatedResponse({
    description: 'Event acknowledged',
  })
  public async createUserConsentChangedEvent(
    @Body()
    eventDto: CreateUserConsentChangedEventDto,
  ) {
    const seenConsentIds = new Set<string>();
    for (const consent of eventDto.consents) {
      if (seenConsentIds.has(consent.id)) {
        throw new BadRequestException(
          'Consents array must contain unique entries',
        );
      }
      seenConsentIds.add(consent.id);
    }

    const user: User | null = await this.userService.findOneById(
      eventDto.user.id,
    );
    if (!user) {
      throw new NotFoundException(User);
    }

    await this.consentService.createUserConsentChangedEvents(
      eventDto.user.id,
      eventDto.consents,
    );
  }
}
