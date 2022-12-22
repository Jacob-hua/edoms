import type { MApp, MPage } from '@edoms/schema';
import { NodeType } from '@edoms/schema';

export interface AppDSLConfig {
  applicationId: string;
  applicationName: string;
}

export const generateEmptyAppDSL = (config: AppDSLConfig): MApp => {
  return {
    id: config.applicationId,
    name: config.applicationName,
    type: NodeType.ROOT,
    items: [],
  };
};

export interface PageDSLConfig {
  pageId: string;
  pageName: string;
}

export const generateEmptyPageDSL = (config: PageDSLConfig): MPage => ({
  id: config.pageId,
  name: config.pageName,
  type: NodeType.PAGE,
  layout: 'absolute',
  style: {
    position: 'relative',
    left: 0,
    top: 0,
    right: '',
    bottom: '',
    width: '100%',
    height: '1728',
    backgroundImage: '',
    backgroundColor: 'rgba(248, 218, 218, 1)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    color: '',
    fontSize: '',
    fontWeight: '',
    overflow: 'auto',
  },
  events: [],
  items: [],
});
