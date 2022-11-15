import {
  DeleteVersion,
  RecoveryReq,
  SaveVersionReq,
  UpdateVersionReq,
  VersionReq,
  VersionRes,
} from '@/api/version/type';
import { request } from '@/util/request';

export const getVersionList = async (data: VersionReq): Promise<VersionRes> => {
  try {
    const { result } = await request<VersionReq, VersionRes>({
      url: '/page/version/list',
      method: 'POST',
      data,
    });
    return result;
  } catch (e) {
    return {
      count: 1,
      limit: '',
      dataList: [],
      page: '',
    };
  }
};

export const updateVersion = async (data: UpdateVersionReq): Promise<void> => {
  await request<UpdateVersionReq, void>({
    url: '/page/version/update',
    method: 'POST',
    data,
  });
};

export const saveWithVersion = async (data: SaveVersionReq): Promise<void> => {
  await request<SaveVersionReq, void>({
    url: '/page/version/save-with-version',
    method: 'POST',
    data,
  });
};

export const recoveryVersion = async (data: RecoveryReq): Promise<void> => {
  await request<RecoveryReq, void>({
    url: 'page/version/version-recovery',
    method: 'POST',
    data,
  });
};

export const deleteVersion = async (data: DeleteVersion): Promise<void> => {
  await request<DeleteVersion, void>({
    url: '/page/version/delete',
    method: 'DELETE',
    data,
  });
};
