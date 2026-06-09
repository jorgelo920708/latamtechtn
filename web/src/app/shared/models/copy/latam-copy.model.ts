import { LandingCopy } from './landing.model';
import { AdminCopy } from './admin.model';

export const LATAM_COPY_ID = 'latam';

export interface LatamCopyModel {
  landing: LandingCopy;
  admin: AdminCopy;
}
