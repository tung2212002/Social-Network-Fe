import { defineStore } from 'pinia';

export const useFriendshipStore = defineStore('friendship', {
    state: () => ({
        friends: [],
        pendings: [],
        requested: [],
        blocks: [],
        numberFriend: 0,
        numberPending: 0,
        numberRequested: 0,
        numberBlock: 0,
    }),
    getters: {
        getFriends: (state) => state.friends,
        getPendings: (state) => state.pendings,
        getRequested: (state) => state.requested,
        getBlocks: (state) => state.blocks,
        getNumberFriend: (state) => state.numberFriend,
        getNumberPending: (state) => state.numberPending,
        getNumberRequested: (state) => state.numberRequested,
        getNumberBlock: (state) => state.numberBlock,
    },
    actions: {
        setFriends(friends) {
            this.friends = friends;
        },
        setNumberFriend(numberFriend) {
            this.numberFriend = numberFriend;
        },
        setNumberPending(numberPending) {
            this.numberPending = numberPending;
        },
        setNumberRequested(numberRequested) {
            this.numberRequested = numberRequested;
        },
        setNumberBlock(numberBlock) {
            this.numberBlock = numberBlock;
        },
        setPendings(pendings) {
            this.pendings = pendings;
        },
        setRequested(requested) {
            this.requested = requested;
        },
        setBlocks(blocks) {
            this.blocks = blocks;
        },
        addFriend(friend) {
            friend = { user: friend, status: 'CLOSE_FRIEND' };
            this.friends.unshift(friend);
        },
        addPending(pending) {
            pending = { user: pending, status: 'PENDING' };
            this.pendings.unshift(pending);
        },
        addRequested(requested) {
            requested = { user: requested, status: 'PENDING' };
            this.requested.unshift(requested);
        },
        addBlock(block) {
            block = { user: block, status: 'BLOCK' };
            this.blocks.unshift(block);
            this.friends = this.friends.filter((friend) => friend.user.userId !== block.user.userId);
            this.pendings = this.pendings.filter((pending) => pending.user.userId !== block.user.userId);
            this.requested = this.requested.filter((requested) => requested.user.userId !== block.user.userId);
        },
        removeFriend(friendId) {
            console.log(friendId);
            console.log(this.friends);
            this.friends = this.friends.filter((friend) => friend.user.userId !== friendId);
            console.log(this.friends);
        },
        removePending(pendingId) {
            this.pendings = this.pendings.filter((pending) => pending.user.userId !== pendingId);
        },
        removeRequested(requestedId) {
            console.log(this.requested);
            console.log(requestedId);
            this.requested = this.requested.filter((requested) => requested.user.userId !== requestedId);
            console.log(this.requested);
        },
        removeBlock(blockId) {
            this.blocks = this.blocks.filter((block) => block.user.userId !== blockId);
        },
        removeFriendByUserId(userId) {
            this.friends = this.friends.filter((friend) => friend.user.userId !== userId);
        },
        removePendingByUserId(userId) {
            this.pendings = this.pendings.filter((pending) => pending.user.userId !== userId);
        },
        removeRequestedByUserId(userId) {
            this.requested = this.requested.filter((requested) => requested.user.userId !== userId);
            console.log(this.requested);
        },
        removeBlockByUserId(userId) {
            this.blocks = this.blocks.filter((block) => block.user.userId !== userId);
        },
        removeFriendByFriendId(friendId) {
            this.friends = this.friends.filter((friend) => friend.user.userId !== friendId);
        },
        addListFriend(friends) {
            this.friends = this.friends.concat(friends);
        },
        addListPending(pendings) {
            this.pendings = this.pendings.concat(pendings);
        },
        addListRequested(requesteds) {
            this.requested = this.requested.concat(requesteds);
        },
        addListBlock(blocks) {
            this.blocks = this.blocks.concat(blocks);
        },
        updateFriend(friend) {
            const friendId = friend.friendId;
            const index = this.friends.findIndex((item) => item.user.userId === friendId);
            if (index !== -1) {
                this.friends[index].status = friend.status;
            }
        },
        updatePending(pending) {
            const pendingId = pending.friendId;
            const index = this.pendings.findIndex((item) => item.user.userId === pendingId);
            if (index !== -1) {
                this.pendings[index].status = pending.status;
            }
        },
        updateRequested(requested) {
            const requestedId = requested.friendId;
            const index = this.requested.findIndex((item) => item.user.userId === requestedId);
            if (index !== -1) {
                this.requested[index].status = requested.status;
            }
        },
        updateBlock(block) {
            const blockId = block.friendId;
            const index = this.blocks.findIndex((item) => item.user.userId === blockId);
            if (index !== -1) {
                this.blocks[index].status = block.status;
            }
        },
    },
});
