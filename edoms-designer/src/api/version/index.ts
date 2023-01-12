import {
  DeleteVersion,
  GetVersionReq,
  GetVersionRes,
  ListVersionsReq,
  ListVersionsRes,
  PublishVersionReq,
  RecoveryVersionReq,
  SaveVersionReq,
  UpdateVersionReq,
} from '@/api/version/type';
import { request } from '@/util/request';

export * from './type';

export default {
  listVersions: async (data: ListVersionsReq): Promise<ListVersionsRes> => {
    try {
      const { result } = await request<ListVersionsReq, ListVersionsRes>({
        url: '/application/version/list',
        method: 'POST',
        data,
      });
      return result;
    } catch (e) {
      return {
        count: 0,
        limit: 0,
        page: 0,
        applicationId: '',
        applicationName: '',
        dataList: [],
      };
    }
  },
  getVersion: async (data: GetVersionReq): Promise<GetVersionRes> => {
    try {
      const { result } = await request<GetVersionReq, GetVersionRes>({
        url: '/application/version',
        method: 'GET',
        data,
      });
      return result;
    } catch (error) {
      return {
        versionId: '',
        name: '',
        description: '',
        createBy: '',
        createTime: -1,
        updateBy: '',
        updateTime: -1,
      };
    }
  },
  updateVersion: async (data: UpdateVersionReq): Promise<void> => {
    await request<UpdateVersionReq, void>({
      url: '/application/version/update',
      method: 'PUT',
      data,
    });
  },
  recoveryVersion: async (data: RecoveryVersionReq): Promise<void> => {
    await request<RecoveryVersionReq, void>({
      url: '/page/version/version-recovery',
      method: 'POST',
      data,
    });
  },
  saveVersion: async (data: SaveVersionReq): Promise<void> => {
    await request<SaveVersionReq, void>({
      url: '/application/version/save',
      method: 'POST',
      data,
    });
  },
  publishVersion: async (data: PublishVersionReq): Promise<void> => {
    await request<PublishVersionReq, void>({
      url: '/page/version/publish',
      method: 'POST',
      data,
    });
  },
  deleteVersion: async (data: DeleteVersion): Promise<void> => {
    await request<DeleteVersion, void>({
      url: '/application/version/delete',
      method: 'DELETE',
      data,
    });
  },
};
