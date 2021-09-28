import { ApiProperty } from '@nestjs/swagger';

export class SerializedHealth {
  @ApiProperty({ example: 'ok' })
  status: 'ok';

  @ApiProperty({ example: 73212 })
  uptime: number;
}
