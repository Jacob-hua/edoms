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

export const updateVersion = async (data: UpdateVersionReq) => {
  await request<UpdateVersionReq, void>({
    url: '/page/version/update',
    method: 'PUT',
    data,
  });
};

export const saveWithVersion = async (data: SaveVersionReq) => {
  await request<SaveVersionReq, void>({
    url: '/page/version/save-with-version',
    method: 'POST',
    data,
  });
};

export const recoveryVersion = async (data: RecoveryReq) => {
  await request<RecoveryReq, void>({
    url: 'page/version/version-recovery',
    method: 'POST',
    data,
  });
};

export const deleteVersion = async (data: DeleteVersion) => {
  await request<DeleteVersion, void>({
    url: '/page/version/delete',
    method: 'DELETE',
    data,
  });
};
