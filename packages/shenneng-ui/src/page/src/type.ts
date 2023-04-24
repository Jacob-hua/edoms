import { MContainer, NodeType } from '@edoms/schema';

export interface MPage extends MContainer {
  type: NodeType.PAGE;
  title?: string;
  cssFile?: string;
}
