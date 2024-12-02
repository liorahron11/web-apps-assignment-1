import request from 'supertest';
import PostModel from "../models/post.model";
import {IPost} from "../interfaces/post.interface";
import server from "../main";
import {IComment} from "../interfaces/comment.interface";
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

beforeAll(async () => {
    await PostModel.create(postMock);
});

afterAll(async () => {
    await PostModel.deleteOne({ id: 999 });
    server.close();
});

describe('Comments API', () => {
    describe('GET /comment', () => {
        it('should return a list of comments of post', async () => {
            const res = await request(server).get('/comment/999');
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body[0]).toMatchObject(postMock.comments[0]);
        });

        it('should return a comment with id 100 in post with id 999', async () => {
            const res = await request(server).get('/comment/999/100');
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject(postMock.comments[0]);
        });
    });

    describe('POST /comment', () => {
        it('should create a new comment on a post', async () => {
            const res = await request(server).post('/comment/999')
                .send({comment: commentMock})
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

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

    describe('PUT /comment', () => {
        it('should update comment content', async () => {
            const newCommentFields: Partial<IComment> = { content: 'new comment content' };

            const res = await request(server).put('/comment/999/100')
                .send(newCommentFields)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

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

    describe('DELETE /comment', () => {
        it('should delete a comment', async () => {
            const res = await request(server).delete('/comment/999/100');

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
