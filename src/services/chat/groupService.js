import * as request from '../../utils/axios';

export const groupService = async () => {
    const response = await request.apiAuth.get('/api/v1/groups');
    return response;
};

export const leaveGroupService = async (groupId) => {
    const response = await request.apiAuth.delete(`/api/v1/groups/${groupId}/members/me`);
    return response;
};
