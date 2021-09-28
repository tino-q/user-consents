import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserConsentChangedEventDto } from '../../src/user/user.dto';
import { ConsentService } from './consent.service';

@ApiTags('Events')
@Controller('events')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
})
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}
  @Post()
  @ApiOperation({ summary: 'Send a user consent changed event' })
  @ApiOkResponse({
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

    await this.consentService.createUserConsentChangedEvents(
      eventDto.user.id,
      eventDto.consents,
    );
  }
}
