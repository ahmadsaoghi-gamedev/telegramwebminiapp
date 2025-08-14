import { createHash } from 'crypto';

export const contractsVersion = '1.0.0';

export function contractHash(): string {
  const schemaNames = [
    'zPaginated',
    'zErrorResponse',
    'zUserProfile',
    'zTitleCard',
    'zTitleListRequest',
    'zTitleListResponse',
    'zTitleDetail',
    'zEpisodeSourcesResponse',
    'zCreatePaymentRequest',
    'zCreatePaymentResponse',
    'zPaymentStatusResponse',
  ];
  const data = schemaNames.join(',');
  return createHash('sha256').update(data).digest('hex').slice(0, 8);
}
