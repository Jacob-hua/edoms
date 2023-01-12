import type { MApp } from '@edoms/schema';
import { NodeType } from '@edoms/schema';

export interface AppDSLConfig {
  applicationId: string;
  applicationName: string;
}

export const generateDefaultDSL = (config: AppDSLConfig): MApp => {
  return {
    id: config.applicationId,
    name: config.applicationName,
    type: NodeType.ROOT,
    items: [],
  };
};
