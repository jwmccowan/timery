import { Brand, createBrander } from '../utils';

export type UUID = Brand<string, 'uuid'>;
export const asUUID = createBrander<UUID>();
