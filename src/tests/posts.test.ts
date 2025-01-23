import request from 'supertest';
import PostModel from "../models/post.model";
import {IPost} from "../interfaces/post.interface";
import server from "../main";
import {IUser} from "../interfaces/user.interface";
import userModel from '../models/user.model';
import postModel from '../models/post.model';

const postMock: IPost = {
    "id": 999,
    "senderId": 155,
    "content": "testing post",
    "comments": []
};

type User = IUser & {
    accessToken?: string,
    refreshToken?: string
  };

const testUser: User = {
    username: "shalev",
    email: "test@user.com",
    password: "Testpassword6677!",
  }

afterEach(async () => {
    await PostModel.deleteOne({ id: 999 });
});

afterAll(async () => {
    console.log("afterAll");
    await userModel.deleteMany();
    await postModel.deleteMany();
    server.close();
});

beforeAll(async () => {
    const response = await request(server).post("/auth/register").send(testUser);
    const response2 = await request(server).post("/auth/login").send(testUser);
    const accessToken = response2.body.accessToken;
    const refreshToken = response2.body.refreshToken;
    testUser.accessToken = accessToken;
    testUser.refreshToken = refreshToken;
    testUser.id = response2.body._id;
})

describe('Posts API', () => {
    describe('GET /posts', () => {
        it('should return a list of users', async () => {
            const res = await request(server).get('/posts/all').set(
                { authorization: "JWT " + testUser.accessToken });
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
        });

        it('should return a post with id 999', async () => {
            await PostModel.create(postMock);

            const res = await request(server).get('/posts/999').set(
                { authorization: "JWT " + testUser.accessToken });;
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject(postMock);
        });

        it('should return a post with senderID 999', async () => {
            await PostModel.create(postMock);

            const res = await request(server).get('/posts?sender=155').set(
                { authorization: "JWT " + testUser.accessToken });;
            expect(res.status).toBe(200);

            const posts: IPost[] = res.body.map((post: IPost) => {
                return {id: post.id, comments: post.comments, content: post.content, senderId: post.senderId}
            });
            expect(posts).toBeInstanceOf(Array);
            expect(posts).toContainEqual(postMock);
        });
    });

    describe('POST /posts', () => {
        it('should create a new post', async () => {
            const res = await request(server).post('/posts')
                .send({post: postMock})
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set({ authorization: "JWT " + testUser.accessToken });;

            expect(res.status).toBe(201);
            expect(res.text).toBe('post added successfully');

            const postInDb = await PostModel.findOne({ id: 999 });
            expect(postInDb).not.toBeNull();
            expect(postInDb?.content).toBe('testing post');
        });
    });

    describe('PUT /posts', () => {
        it('should update post content', async () => {
            await PostModel.create(postMock);

            const newPostFields: Partial<IPost> = { content: 'new post content' };

            const res = await request(server).put('/posts/999')
                .send(newPostFields)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set({ authorization: "JWT " + testUser.accessToken });;

            expect(res.status).toBe(200);
            expect(res.text).toContain('updated successfully');

            const postInDb = await PostModel.findOne({ id: 999 });
            expect(postInDb).not.toBeNull();
            expect(postInDb?.content).toBe(newPostFields.content);
        });
    });
});
