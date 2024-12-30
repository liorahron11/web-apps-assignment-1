import request from 'supertest';
import PostModel from "../models/post.model";
import {IPost} from "../interfaces/post.interface";
import server from "../main";
const postMock: IPost = {
    "id": 999,
    "senderId": 155,
    "content": "testing post",
    "comments": []
};

afterEach(async () => {
    await PostModel.deleteOne({ id: 999 });
});

afterAll(async () => {
    server.close();
});

describe('Posts API', () => {
    describe('GET /post', () => {
        it('should return a list of users', async () => {
            const res = await request(server).get('/post/all');
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
        });

        it('should return a post with id 999', async () => {
            await PostModel.create(postMock);

            const res = await request(server).get('/post/999');
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject(postMock);
        });

        it('should return a post with senderID 999', async () => {
            await PostModel.create(postMock);

            const res = await request(server).get('/post?sender=155');
            expect(res.status).toBe(200);

            const posts: IPost[] = res.body.map((post: IPost) => {
                return {id: post.id, comments: post.comments, content: post.content, senderId: post.senderId}
            });
            expect(posts).toBeInstanceOf(Array);
            expect(posts).toContainEqual(postMock);
        });
    });

    describe('POST /post', () => {
        it('should create a new post', async () => {
            const res = await request(server).post('/post')
                .send({post: postMock})
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

            expect(res.status).toBe(201);
            expect(res.text).toBe('post added successfully');

            const postInDb = await PostModel.findOne({ id: 999 });
            expect(postInDb).not.toBeNull();
            expect(postInDb?.content).toBe('testing post');
        });
    });

    describe('PUT /post', () => {
        it('should update post content', async () => {
            await PostModel.create(postMock);

            const newPostFields: Partial<IPost> = { content: 'new post content' };

            const res = await request(server).put('/post/999')
                .send(newPostFields)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

            expect(res.status).toBe(200);
            expect(res.text).toContain('updated successfully');

            const postInDb = await PostModel.findOne({ id: 999 });
            expect(postInDb).not.toBeNull();
            expect(postInDb?.content).toBe(newPostFields.content);
        });
    });
});
