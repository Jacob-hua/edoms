import {
  DeleteVersion,
  RecoveryVersionReq,
  SaveWithVersionReq,
  UpdateVersionReq,
  VersionReq,
  VersionRes,
} from '@/api/version/type';
import { request } from '@/util/request';

export * from './type';

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
      count: 0,
      limit: 0,
      page: 0,
      dataList: [],
    };
  }
};

export const updateVersion = async (data: UpdateVersionReq): Promise<void> => {
  await request<UpdateVersionReq, void>({
    url: '/page/version/update',
    method: 'PUT',
    data,
  });
};

export const saveWithVersion = async (data: SaveWithVersionReq): Promise<void> => {
  await request<SaveWithVersionReq, void>({
    url: '/page/version/save-with-version',
    method: 'POST',
    data,
  });
};

export const recoveryVersion = async (data: RecoveryVersionReq): Promise<void> => {
  await request<RecoveryVersionReq, void>({
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
