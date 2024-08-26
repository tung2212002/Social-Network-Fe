import { defineStore } from 'pinia';

export const usePostStore = defineStore('post', {
    state: () => ({
        homePost: [],
        minePost: [],
        isLoadingHomePost: false,
        isLoadingMinePost: false,
    }),
    getters: {
        getHomePost: (state) => state.homePost,
        getMinePost: (state) => state.minePost,
        getIsLoadingHomePost: (state) => state.isLoadingHomePost,
        getIsLoadingMinePost: (state) => state.isLoadingMinePost,
    },
    actions: {
        setHomePost(posts) {
            this.homePost = posts;
        },
        setIsLoadingHomePost(isLoading) {
            this.isLoadingHomePost = isLoading;
        },
        setMinePost(posts) {
            this.minePost = posts;
        },
        setIsLoadingMinePost(isLoading) {
            this.isLoadingMinePost = isLoading;
        },
        addListHomePost(posts) {
            this.homePost = this.homePost.concat(posts);
            this.isLoadingHomePost = false;
        },
        addListMinePost(posts) {
            this.minePost = this.minePost.concat(posts);
            this.isLoadingMinePost = false;
        },
        addHomePost(post) {
            this.homePost.unshift(post);
        },
        addMinePost(post) {
            this.minePost.unshift(post);
        },
        addPost(post) {
            this.homePost.unshift(post);
            this.minePost.unshift(post);
        },
        removeHomePost(postId) {
            this.homePost = this.homePost.filter((post) => post.postId !== postId);
        },
        removeMinePost(postId) {
            this.minePost = this.minePost.filter((post) => post.postId !== postId);
        },
        removePost(postId) {
            this.homePost = this.homePost.filter((post) => post.postId !== postId);
            this.minePost = this.minePost.filter((post) => post.postId !== postId);
        },
        removePostByUserId(userId) {
            this.homePost = this.homePost.filter((post) => post.user.userId !== userId);
            this.minePost = this.minePost.filter((post) => post.user.userId !== userId);
        },
        updatePost(post) {
            console.log('1');
            const postId = post.postId;
            let indexHome = this.homePost.findIndex((item) => item.postId === postId);
            let indexMine = this.minePost.findIndex((item) => item.postId === postId);

            // if (indexHome !== -1) {
            //     // this.homePost.splice(indexHome, 1);
            //     this.homePost.splice(indexHome, 0, post);
            // }
            this.homePost = this.homePost.filter((post) => post.postId !== postId);
            if (indexHome !== -1) {
                // this.homePost.splice(indexHome, 1);
                this.homePost.splice(indexHome, 0, post);
            }
            this.minePost = this.minePost.filter((post) => post.postId !== postId);
            // if (indexMine !== -1) {
            //     // this.minePost.splice(indexMine, 1);
            //     this.homePost.splice(indexMine, 0, post);
            // }
            // this.homePost = this.homePost.filter((post, index) => {
            //     indexHome = index;
            //     post.postId !== postId;
            // });
            // this.homePost.this.minePost = this.minePost.filter((post, index) => {
            //     indexMine = index;
            //     post.postId !== postId;
            // });
        },
    },
});
