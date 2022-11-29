import { MApp, NodeType } from '@edoms/schema';

export interface DefaultAppDSLConfig {
  applicationId: string;
  applicationName: string;
  pageId: string;
  pageName: string;
}

export const generateDSL = (config: DefaultAppDSLConfig): MApp => {
  return {
    id: config.applicationId,
    name: config.applicationName,
    type: NodeType.ROOT,
    items: [
      {
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
        },
        events: [],
        items: [],
      },
    ],
  };
};
