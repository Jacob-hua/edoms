import {
  DeleteVersion,
  GetVersionReq,
  GetVersionRes,
  ListVersionsReq,
  ListVersionsRes,
  RecoveryVersionReq,
  SaveWithVersionReq,
  UpdateVersionReq,
} from '@/api/version/type';
import { request } from '@/util/request';

export * from './type';

export default {
  listVersions: async (data: ListVersionsReq): Promise<ListVersionsRes> => {
    try {
      const { result } = await request<ListVersionsReq, ListVersionsRes>({
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
  },
  getVersion: async (data: GetVersionReq): Promise<GetVersionRes> => {
    try {
      const { result } = await request<GetVersionReq, GetVersionRes>({
        url: '/page/version',
        method: 'GET',
        data,
      });
      return result;
    } catch (error) {
      return {
        versionId: '',
        name: '',
        pageId: '',
        editContentId: '',
        createBy: '',
        createTime: -1,
      };
    }
  },
  updateVersion: async (data: UpdateVersionReq): Promise<void> => {
    await request<UpdateVersionReq, void>({
      url: '/page/version/update',
      method: 'PUT',
      data,
    });
  },
  saveWithVersion: async (data: SaveWithVersionReq): Promise<void> => {
    await request<SaveWithVersionReq, void>({
      url: '/page/version/save-with-version',
      method: 'POST',
      data,
    });
  },
  recoveryVersion: async (data: RecoveryVersionReq): Promise<void> => {
    await request<RecoveryVersionReq, void>({
      url: 'page/version/version-recovery',
      method: 'POST',
      data,
    });
  },
  deleteVersion: async (data: DeleteVersion): Promise<void> => {
    await request<DeleteVersion, void>({
      url: '/page/version/delete',
      method: 'DELETE',
      data,
    });
  },
};
