import { ApiProperty } from '@nestjs/swagger';

export class DeployBallotDto {
  @ApiProperty({
    type: Array,
    required: true,
    default: ['Proposal 1', 'Proposal 2', 'Proposal 3'],
  })
  proposals: string[];

  @ApiProperty({
    type: Number,
    required: true,
    default: 100000,
  })
  targetBlockNumber: number;
}