import request from 'supertest';
import UserModel from '../models/user.model';
import {IUser} from "../interfaces/user.interface";
import server from "../main";
import userModel from '../models/user.model';

beforeAll(async () => {
    console.log("beforeAll");
    await userModel.deleteMany();
  });

afterAll(async () => {
    console.log("afterAll");
    server.close();
});

const baseUrl = "/auth";

const testUser: IUser = {
    username: "shalev",
    email: "test@user.com",
    password: "Testpassword6677!",
}

describe('register', () => {
    test("Auth test register", async () => {
        const response = await request(server).post(baseUrl + "/register").send(testUser);
        expect(response.statusCode).toBe(201);
    });

    test("Auth test register fail", async () => {
        const response = await request(server).post(baseUrl + "/register").send(testUser);
        expect(response.statusCode).not.toBe(200);
      });

});
