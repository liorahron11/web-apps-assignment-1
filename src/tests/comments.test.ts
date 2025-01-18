import request from 'supertest';
import PostModel from "../models/post.model";
import {IPost} from "../interfaces/post.interface";
import server from "../main";
import {IComment} from "../interfaces/comment.interface";
import {IUser} from "../interfaces/user.interface";
import userModel from '../models/user.model';
import postModel from '../models/post.model';

const postMock: IPost = {
    id: 999,
    senderId: 155,
    content: "testing post",
    comments: [
        {
            id: 100,
            content: 'test comment',
            senderId: 345
        }
    ]
};
const commentMock: IComment = {
    content: 'new comment',
    senderId: 92
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
    await PostModel.create(postMock);
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
    describe('GET /comments', () => {
        it('should return a list of comments of post', async () => {
            const res = await request(server).get('/comments/999').set(
                { authorization: "JWT " + testUser.accessToken });
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body[0]).toMatchObject(postMock.comments[0]);
        });

        it('should return a comment with id 100 in post with id 999', async () => {
            const res = await request(server).get('/comments/999/100').set(
                { authorization: "JWT " + testUser.accessToken });
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject(postMock.comments[0]);
        });
    });

    describe('POST /comments', () => {
        it('should create a new comment on a post', async () => {
            const res = await request(server).post('/comments/999')
                .send({comment: commentMock})
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set({ authorization: "JWT " + testUser.accessToken });

            expect(res.status).toBe(201);
            expect(res.text).toBe('comment added successfully');

            const postInDb: IPost = await PostModel.findOne({ id: 999 }).lean();
            const commentsInDb: IComment[] = postInDb.comments;
            expect(commentsInDb).not.toBeNull();
            expect(commentsInDb).toBeInstanceOf(Array);

            const addedCommentInDb: IComment = commentsInDb.find((comment: IComment) => comment.id === commentsInDb.length);
            expect(addedCommentInDb).not.toBeNull();
            expect(addedCommentInDb).toMatchObject(commentMock);
        });
    });

    describe('PUT /comments', () => {
        it('should update comment content', async () => {
            const newCommentFields: Partial<IComment> = { content: 'new comment content' };

            const res = await request(server).put('/comments/999/100')
                .send(newCommentFields)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set({ authorization: "JWT " + testUser.accessToken });

            expect(res.status).toBe(200);
            expect(res.text).toContain('comment updated successfully');

            const postInDb = await PostModel.findOne({ id: 999 }).lean();
            const commentsInDb: IComment[] = postInDb?.comments;
            expect(commentsInDb).not.toBeNull();
            expect(commentsInDb).toBeInstanceOf(Array);

            const updatedCommentInDb: IComment = commentsInDb.find((comment: IComment) => comment.id === 100);
            expect(updatedCommentInDb).not.toBeNull();
            expect(updatedCommentInDb?.content).toBe(newCommentFields.content);
        });
    });

    describe('DELETE /comments', () => {
        it('should delete a comment', async () => {
            const res = await request(server).delete('/comments/999/100').set(
                { authorization: "JWT " + testUser.accessToken });

            expect(res.status).toBe(200);
            expect(res.text).toContain('comment deleted successfully');

            const postInDb = await PostModel.findOne({ id: 999 }).lean();
            const commentsInDb: IComment[] = postInDb?.comments;
            expect(commentsInDb).toBeInstanceOf(Array);

            const updatedCommentInDb: IComment = commentsInDb.find((comment: IComment) => comment.id === 100);
            expect(updatedCommentInDb).toBeUndefined();
        });
    });
});
