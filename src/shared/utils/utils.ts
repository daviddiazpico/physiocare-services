import { BadRequestException } from '@nestjs/common';

export function checkIfIdIsValid(id: string): void {
  if (!id.match(/^\d+$/)) {
    throw new BadRequestException('ID must be a number');
  }
}
