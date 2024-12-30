import request from 'supertest';
import UserModel from '../models/user.model';
import {IUser} from "../interfaces/user.interface";
import server from "../main";

afterEach(async () => {
});

afterAll(async () => {
    server.close();
});

describe('User API', () => {
    var userId; 
    describe('GET /user', () =>  
        it('should return a list of users', async () => {
            const res = await request(server).get('/user/all');
            userId = res.body[0]._id;
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
        }));

        it('should return a user with id', async () => {
            const res = await request(server).get(`/user/${userId}`);
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({ email: 'jane555@example.com', password: 'Jane1234!' });
        });

    });

    describe('POST /user', () => {
        it('should create a new user', async () => {
            const newUser: IUser = { email: 'jane777@example.com', password: 'Jane1234!' };

            const res = await request(server).post('/user')
                .send({user: newUser})
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

            expect(res.status).toBe(201);
            expect(res.text).toBe('user created');

            const userInDb = await UserModel.findOne({ email: newUser.email });
            await UserModel.deleteOne({ _id: userInDb.id });
            expect(userInDb).not.toBeNull();
            expect(userInDb?.email).toBe('jane777@example.com');
        });
    });

    describe('PUT /user', () => {
        it('should update user email and password', async () => {
            const createdUser = await UserModel.create({email: 'jane1111@example.com', password: 'Jane1234!'});

            const newUserFields: Partial<IUser> = { email: 'israel@example.com', password: 'newPassword123!' };

            const res = await request(server).put(`/user/${createdUser.id}`)
                .send(newUserFields)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

            expect(res.status).toBe(200);
            expect(res.text).toContain('updated successfully');

            const userInDb = await UserModel.findOne({ _id: createdUser.id });
            await UserModel.deleteOne({ _id: userInDb.id });
            expect(userInDb).not.toBeNull();
            expect(userInDb?.email).toBe(newUserFields.email);
            expect(userInDb?.password).toBe(newUserFields.password);
        });
    });

    describe('DELETE /user', () => {
        it('should delete a user', async () => {
            const createdUser = await UserModel.create({ username: 'Jane Doe', email: 'jane@example.com', password: 'Jane1234!'});

            const res = await request(server).delete(`/user/${createdUser.id}`)

            expect(res.status).toBe(200);
            expect(res.text).toBe('user deleted successfully');

            const userInDb = await UserModel.findOne({ _id: createdUser.id });
            expect(userInDb).toBeNull();
        });
    });
