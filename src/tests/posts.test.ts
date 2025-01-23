import request from 'supertest';
import PostModel from "../models/post.model";
import {IPost} from "../interfaces/post.interface";
import server from "../main";
import {IUser} from "../interfaces/user.interface";
import userModel from '../models/user.model';
import postModel from '../models/post.model';

const postMock: IPost = {
    "senderId": "155",
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
    describe('POST /posts', () => {
        it('should create a new post', async () => {
            const res = await request(server).post('/posts')
                .send({post: postMock})
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set({ authorization: "JWT " + testUser.accessToken });;

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Post added successfully');
            expect(res.body.postId).toBeDefined();
            postMock.id = res.body.postId;

            const postInDb = await PostModel.findOne({ _id: postMock.id });
            expect(postInDb).not.toBeNull();
            expect(postInDb?.content).toBe('testing post');
        });
    });

    describe('GET /posts', () => {
        it('should return a list of posts', async () => {
            const res = await request(server).get('/posts/all').set(
                { authorization: "JWT " + testUser.accessToken });
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
        });

        it('should return a post with mock post id ', async () => {

            const res = await request(server).get(`/posts/${postMock.id}`).set(
                { authorization: "JWT " + testUser.accessToken });
            expect(res.status).toBe(200);
            expect(res.body._id).toBe(postMock.id);
        });

        it('should return a post with senderID 155', async () => {
            await PostModel.create(postMock);

            const res = await request(server).get('/posts?sender=155').set(
                { authorization: "JWT " + testUser.accessToken });;
            expect(res.status).toBe(200);

            const posts: IPost[] = res.body.map((post: any) => {
                return {id: post._id, comments: post.comments, content: post.content, senderId: post.senderId}
            });
            expect(posts).toBeInstanceOf(Array);
            expect(posts).toContainEqual(postMock);
        });
    });


    describe('PUT /posts', () => {
        it('should update post content', async () => {

            const newPostFields: Partial<IPost> = { content: 'new post content' };

            const res = await request(server).put(`/posts/${postMock.id}`)
                .send(newPostFields)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set({ authorization: "JWT " + testUser.accessToken });;

            expect(res.status).toBe(200);
            expect(res.text).toContain('updated successfully');

            const postInDb = await PostModel.findOne({ _id: postMock.id });
            expect(postInDb).not.toBeNull();
            expect(postInDb?.content).toBe(newPostFields.content);
        });
    });

    describe('Posts API - Failures', () => {
        describe('POST /posts', () => {
            it('should fail when required fields are missing', async () => {
                const invalidPostMock = {
                    // Missing 'senderId' and 'content' which are required
                    comments: []
                };
    
                const res = await request(server).post('/posts')
                    .send({ post: invalidPostMock })
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .set({ authorization: "JWT " + testUser.accessToken });
    
                // Expect failure because required fields are missing
                expect(res.status).toBe(500); // Server responds with 500 according to the controller
                expect(res.text).toBe('error adding post'); // Error message from the controller
            });
    
            it('should fail when user is unauthorized', async () => {
                const postMockWithValidData = {
                    senderId: "155",
                    content: "testing post",
                    comments: []
                };
    
                // Simulating a missing authorization header
                const res = await request(server).post('/posts')
                    .send({ post: postMockWithValidData })
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json');
    
                // Expect failure because the user is not authorized
                expect(res.status).toBe(401); // Controller returns 500 for unauthorized access
                expect(res.text).toBe('Access Denied');
            });
    
  
        });
    
        describe('GET /posts', () => {
            it('should fail when post not found by id', async () => {
                // Using a non-existent postId
                const nonExistentPostId = "1234567890abcdef";
    
                const res = await request(server).get(`/posts/${nonExistentPostId}`).set(
                    { authorization: "JWT " + testUser.accessToken });
    
                // Expect failure due to post not being found
                expect(res.status).toBe(500); // Controller returns 500 if post is not found
                expect(res.text).toBe('error finding post'); // Error message from the controller
            });
    
            it('should fail when senderId is missing in query', async () => {
                const res = await request(server).get('/posts').set(
                    { authorization: "JWT " + testUser.accessToken });
    
                // Expect failure because senderId is missing in query
                expect(res.status).toBe(500); // Controller returns 500 when senderId is not provided
                expect(res.text).toBe('sender ID should be a number');
            });
        });
    });
    
});
