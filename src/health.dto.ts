import { ApiProperty } from '@nestjs/swagger';

export class SerializedHealth {
  @ApiProperty()
  status: 'ok';

  @ApiProperty()
  uptime: number;
}
