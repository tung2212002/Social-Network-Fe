import * as request from '../../utils/axios';

export const groupService = async () => {
    const response = await request.apiAuth.get('/api/v1/groups');
    return response;
};

export const leaveGroupService = async (groupId) => {
    const response = await request.apiAuth.delete(`/api/v1/groups/${groupId}/members/me`);
    return response;
};

export const changeGroupNameService = async (body) => {
    const response = await request.apiAuth.patch(`/api/v1/groups/name`, body);
    return response;
};

export const changeNickNameService = async (body) => {
    const response = await request.apiAuth.patch(`/api/v1/groups/members/nickname`, body);
    return response;
};

export const changeStateGroupService = async (groupId, state) => {
    const response = await request.apiAuth.patch(`/api/v1/groups/${groupId}?state=${state}`);
    return response;
};

export const getGroupMembersService = async (groupId) => {
    const response = await request.apiAuth.get(`/api/v1/groups/members/${groupId}`);
    return response;
};

export const kickGroupMemberService = async (body) => {
    const response = await request.apiAuth.delete(`/api/v1/groups/members`, body);
    return response;
};

export const changeBackgroundGroupService = async (groupId, file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await request.apiAuth.patch(`/api/v1/groups/${groupId}/background`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response;
};
