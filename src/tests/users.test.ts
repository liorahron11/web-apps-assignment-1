import request from 'supertest';
import app from '../main';
import UserModel from '../models/user.model';
import {IUser} from "../interfaces/user.interface";

afterEach(async () => {
    await UserModel.deleteOne({ id: 999 });
});

afterAll(async () => {
    app.close();
});

describe('User API', () => {
    describe('GET /user', () => {
        it('should return a list of users', async () => {
            const res = await request(app).get('/user/all');
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
        });

        it('should return a user with id 999', async () => {
            await UserModel.create({ username: 'Jane Doe', email: 'jane@example.com', password: '1234', id: 999 });

            const res = await request(app).get('/user/999');
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({ username: 'Jane Doe', email: 'jane@example.com', password: '1234', id: 999 });
            await UserModel.deleteOne({ id: 999 });
        });
    });

    describe('POST /user', () => {
        it('should create a new user', async () => {
            const newUser: IUser = { username: 'Jane Doe', email: 'jane@example.com', password: 'Jane1234!', id: 999 };

            const res = await request(app).post('/user')
                .send({user: newUser})
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

            expect(res.status).toBe(201);
            expect(res.text).toBe('user created');

            const userInDb = await UserModel.findOne({ id: 999 });
            expect(userInDb).not.toBeNull();
            expect(userInDb?.username).toBe('Jane Doe');
        });
    });

    describe('PUT /user', () => {
        it('should update user email and password', async () => {
            await UserModel.create({ username: 'Jane Doe', email: 'jane@example.com', password: 'Jane1234!', id: 999 });

            const newUserFields: Partial<IUser> = { email: 'israel@example.com', password: 'newPassword123!' };

            const res = await request(app).put('/user/999')
                .send(newUserFields)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

            expect(res.status).toBe(200);
            expect(res.text).toContain('updated successfully');

            const userInDb = await UserModel.findOne({ id: 999 });
            expect(userInDb).not.toBeNull();
            expect(userInDb?.email).toBe('israel@example.com');
            expect(userInDb?.password).toBe('newPassword123!');
        });
    });

    describe('DELETE /user', () => {
        it('should delete a user', async () => {
            await UserModel.create({ username: 'Jane Doe', email: 'jane@example.com', password: 'Jane1234!', id: 999 });

            const res = await request(app).delete('/user/999')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

            expect(res.status).toBe(200);
            expect(res.text).toBe('user deleted successfully');

            const userInDb = await UserModel.findOne({ id: 999 });
            expect(userInDb).toBeNull();
        });
    });
});
