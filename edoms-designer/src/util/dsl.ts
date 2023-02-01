import type { MApp } from '@edoms/schema';
import { NodeType } from '@edoms/schema';

export interface AppDSLConfig {
  applicationId: string;
  applicationName: string;
  tenantId?: string;
}

export const generateDefaultDSL = (config: AppDSLConfig): MApp => {
  return {
    id: config.applicationId,
    name: config.applicationName,
    type: NodeType.ROOT,
    tenantId: config.tenantId,
    items: [
      {
        id: 'edoms_page_f0ae683d',
        type: NodeType.PAGE,
        layout: 'absolute',
        style: {
          width: '100%',
          height: '100%',
          position: 'relative',
          top: 0,
          left: 0,
        },
        name: 'index',
        items: [
          {
            id: 'edoms_text_5f79fac4',
            type: 'text',
            style: {
              width: 403,
              height: 89,
              position: 'absolute',
              top: 121,
              left: 216,
              right: '',
              bottom: '',
              padding: '',
              margin: '',
              borderTopStyle: '',
              borderTopColor: '',
              borderTopWidth: '',
              borderTopLeftRadius: '',
              borderTopRightRadius: '',
              borderRightStyle: '',
              borderRightColor: '',
              borderRightWidth: '',
              borderBottomStyle: '',
              borderBottomColor: '',
              borderBottomWidth: '',
              borderBottomLeftRadius: '',
              borderBottomRightRadius: '',
              borderLeftStyle: '',
              borderLeftColor: '',
              borderLeftWidth: '',
              backgroundImage: '',
              backgroundColor: '',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 100%',
              color: '',
              fontSize: '33',
              fontWeight: '',
              transform: {
                rotate: '',
                scale: '',
              },
            },
            name: '文本',
            text: 'E-DOMS',
            multiple: true,
            inputEvent: {
              isTrusted: true,
              _vts: 1673591403165,
            },
            events: [],
          },
        ],
      },
    ],
  };
};
