import request from 'supertest';
import PostModel from "../models/post.model";
import {IPost} from "../interfaces/post.interface";
import server from "../main";
import {IComment} from "../interfaces/comment.interface";
import {IUser} from "../interfaces/user.interface";
import userModel from '../models/user.model';
import postModel from '../models/post.model';

const postMock: IPost = {
    senderId: "156",
    content: "testing post",
    comments: [
        {
            content: 'test comment',
            senderId: "345"
        }
    ]
};
const commentMock: IComment = {
    content: 'new comment',
    senderId: "92"
}

type User = IUser & {
    accessToken?: string,
    refreshToken?: string
  };

const testUser: User = {
    username: "shalev",
    email: "test@user.com",
    password: "Testpassword6677!",
}

beforeAll(async () => {
    const savedPost: IPost = await PostModel.create(postMock);
    postMock.id = savedPost.id;
    postMock.comments[0].id = savedPost.comments[0].id;
    const response = await request(server).post("/auth/register").send(testUser);
    const response2 = await request(server).post("/auth/login").send(testUser);
    const accessToken = response2.body.accessToken;
    const refreshToken = response2.body.refreshToken;
    testUser.accessToken = accessToken;
    testUser.refreshToken = refreshToken;
    testUser.id = response2.body._id;
})

afterAll(async () => {
    console.log("afterAll");
    await userModel.deleteMany();
    await postModel.deleteMany();
    server.close();
});

describe('Comments API', () => {
    describe('POST /comments', () => {
        it('should create a new comment on a post', async () => {
            const res = await request(server).post(`/comments/${postMock.id}`)
                .send({comment: commentMock})
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set({ authorization: "JWT " + testUser.accessToken });

            expect(res.status).toBe(201);
            expect(res.text).toBe('comment added successfully');

            const postInDb: IPost = await PostModel.findOne({ _id: postMock.id }).lean();
            const commentsInDb: IComment[] = postInDb.comments;
            expect(commentsInDb).not.toBeNull();
            expect(commentsInDb).toBeInstanceOf(Array);

            const addedCommentInDb: IComment = commentsInDb[1];
            expect(addedCommentInDb).not.toBeNull();
            expect(addedCommentInDb).toMatchObject(commentMock);
        });
        
            it('should return an error when the user is not authorized to add a comment', async () => {
                const res = await request(server).post(`/comments/${postMock.id}`)
                    .send({ comment: commentMock })
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .set({ authorization: "JWT " + 'invalidAccessToken' });
        
                expect(res.status).toBe(401);
                expect(res.text).toContain('Access Denied');
            });
    });

    describe('GET /comments', () => {
        it('should return a list of comments of post', async () => {
            const res = await request(server).get(`/comments/${postMock.id}`).set(
                { authorization: "JWT " + testUser.accessToken });

                const comments: IComment[] = res.body.map((comment: any) => {
                    return {id: comment._id, content: comment.content, senderId: comment.senderId}
                });
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(comments[0]).toMatchObject(postMock.comments[0]);
        });

        it('should return a comment with id in post with id 345', async () => {
            const res = await request(server).get(`/comments/${postMock.id}/${postMock.comments[0].id}`).set(
                { authorization: "JWT " + testUser.accessToken });
            const comment: any = res.body;
            const retComment = { _id: comment._id, content: comment.content, senderId: comment.senderId};                
            expect(res.status).toBe(200);
            expect(retComment).toMatchObject(comment);
        });
    });

    describe('PUT /comments', () => {
        it('should update comment content', async () => {
            const newCommentFields: Partial<IComment> = { content: 'new comment content' };

            const res = await request(server).put(`/comments/${postMock.id}/${postMock.comments[0].id}`)
                .send(newCommentFields)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set({ authorization: "JWT " + testUser.accessToken });

            expect(res.status).toBe(200);
            expect(res.text).toContain('comment updated successfully');

            const postInDb = await PostModel.findOne({  _id: postMock.id }).lean();
            const commentsInDb: IComment[] = postInDb?.comments;
            expect(commentsInDb).not.toBeNull();
            expect(commentsInDb).toBeInstanceOf(Array);

            const updatedCommentInDb: IComment = commentsInDb.find((comment: any) => String(comment._id) === postMock.comments[0].id);
            expect(updatedCommentInDb).not.toBeNull();
            expect(updatedCommentInDb?.content).toBe(newCommentFields.content);
        });
        
        it('should return an error when providing an invalid comment ID for update', async () => {
            const invalidCommentId = 'invalidCommentId';
            const newCommentFields: Partial<IComment> = { content: 'updated comment content' };
    
            const res = await request(server).put(`/comments/${postMock.id}/${invalidCommentId}`)
                .send(newCommentFields)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set({ authorization: "JWT " + testUser.accessToken });
    
            expect(res.status).toBe(500);
            expect(res.text).toContain('error while update the comment');
        });
    });
    

    describe('DELETE /comments', () => {
        it('should delete a comment', async () => {
            const res = await request(server).delete(`/comments/${postMock.id}/${postMock.comments[0].id}`).set(
                { authorization: "JWT " + testUser.accessToken });

            expect(res.status).toBe(200);
            expect(res.text).toContain('comment deleted successfully');

            const postInDb = await PostModel.findOne({ _id: postMock.id }).lean();
            const commentsInDb: IComment[] = postInDb?.comments;
            expect(commentsInDb).toBeInstanceOf(Array);

            const updatedCommentInDb: IComment = commentsInDb.find((comment: any) => String(comment._id) === postMock.comments[0].id);
            expect(updatedCommentInDb).toBeUndefined();
        });

        it('should return an error when attempting to delete a non-existing comment', async () => {
            const nonExistingCommentId = 'nonExistingCommentId';
    
            const res = await request(server).delete(`/comments/${postMock.id}/${nonExistingCommentId}`)
                .set({ authorization: "JWT " + testUser.accessToken });
    
            expect(res.status).toBe(500);
            expect(res.text).toContain('error while deleting comment');
        });
    });
});
