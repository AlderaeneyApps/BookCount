import { ACTION_TYPE } from './action-type.enum';

export interface ModalFormInfo {
  mode?: ACTION_TYPE;
  elementId?: number;
  parentId?: number;
}
