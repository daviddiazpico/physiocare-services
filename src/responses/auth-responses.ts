import { BaseResponse } from './base-response';

export interface TokenResponse extends BaseResponse {
  token: string;
}
