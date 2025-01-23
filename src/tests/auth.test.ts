import request from 'supertest';
import {IUser} from "../interfaces/user.interface";
import server from "../main";
import userModel from '../models/user.model';
import postModel from '../models/post.model';

beforeAll(async () => {
    console.log("beforeAll");
    await userModel.deleteMany();
  });

afterAll(async () => {
    console.log("afterAll");
    await userModel.deleteMany();
    await postModel.deleteMany();
    server.close();
    
});

const baseUrl = "/auth";

  type User = IUser & {
    accessToken?: string,
    refreshToken?: string
  };
  
  const testUser: User = {
    username: "shalev",
    email: "test@user.com",
    password: "Testpassword6677!",
  }

describe("Auth Tests", () => {
    test("Auth test register", async () => {
      const response = await request(server).post(baseUrl + "/register").send(testUser);
      expect(response.statusCode).toBe(200);
    });
  
    test("Auth test register fail", async () => {
      const response = await request(server).post(baseUrl + "/register").send(testUser);
      expect(response.statusCode).not.toBe(200);
    });
  
    test("Auth test register fail", async () => {
      const response = await request(server).post(baseUrl + "/register").send({
        email: "sdsdfsd",
      });
      expect(response.statusCode).not.toBe(200);
      const response2 = await request(server).post(baseUrl + "/register").send({
        email: "",
        password: "sdfsd",
      });
      expect(response2.statusCode).not.toBe(200);
    });
  
    test("Auth test login", async () => {
      const response = await request(server).post(baseUrl + "/login").send(testUser);
      expect(response.statusCode).toBe(200);
      const accessToken = response.body.accessToken;
      const refreshToken = response.body.refreshToken;
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
      expect(response.body._id).toBeDefined();
      testUser.accessToken = accessToken;
      testUser.refreshToken = refreshToken;
      testUser.id = response.body._id;
    });
  
    test("Check tokens are not the same", async () => {
      const response = await request(server).post(baseUrl + "/login").send(testUser);
      const accessToken = response.body.accessToken;
      const refreshToken = response.body.refreshToken;
  
      expect(accessToken).not.toBe(testUser.accessToken);
      expect(refreshToken).not.toBe(testUser.refreshToken);
    });
  
    test("Auth test login fail, wrong pass, wrong email ", async () => {
      const response = await request(server).post(baseUrl + "/login").send({
        email: testUser.email,
        password: "sdfsd",
      });
      expect(response.statusCode).not.toBe(200);
  
      const response2 = await request(server).post(baseUrl + "/login").send({
        email: "dsfasd",
        password: "sdfsd",
      });
      expect(response2.statusCode).not.toBe(200);
    });
  
    test("Auth test me", async () => {
      const response = await request(server).post("/posts").send({
        post : {
        senderId: "155",
        content: "testing post",
        comments: []
      }});
      expect(response.statusCode).not.toBe(201);
      const response2 = await request(server).post("/posts").set(
        { authorization: "JWT " + testUser.accessToken }
      ).send({
        post : {
        senderId: "155",
        content: "testing post",
        comments: []
      }});
      expect(response2.statusCode).toBe(201);
    });
  
    test("Test refresh token", async () => {
      const response = await request(server).post(baseUrl + "/refresh").set(
            { authorization: "JWT " + testUser.accessToken })
      .send({
        userId: testUser.id,
        token: testUser.refreshToken,
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      testUser.accessToken = response.body.accessToken;
      testUser.refreshToken = response.body.refreshToken;
    });
  
    test("Double use refresh token", async () => {
      const response = await request(server).post(baseUrl + "/refresh").set(
        { authorization: "JWT " + testUser.accessToken }).send({
          userId: testUser.id,
          token: testUser.refreshToken,
        });
      expect(response.statusCode).toBe(200);
      const refreshTokenNew = response.body.refreshToken;
  
      const response2 = await request(server).post(baseUrl + "/refresh").set(
        { authorization: "JWT " + testUser.accessToken }).send({});
      expect(response2.statusCode).not.toBe(200);
  
      const response3 = await request(server).post(baseUrl + "/refresh").set(
        { authorization: "JWT " + refreshTokenNew }).send({});
      expect(response3.statusCode).not.toBe(200);
    });
  
    test("Test logout", async () => {
      const response = await request(server).post(baseUrl + "/login").send(testUser);
      expect(response.statusCode).toBe(200);
      testUser.accessToken = response.body.accessToken;
      testUser.refreshToken = response.body.refreshToken;
  
      const response2 = await request(server).post(baseUrl + "/logout").set(
        { authorization: "JWT " + testUser.accessToken }).send({
          userId: testUser.id,
          token: testUser.refreshToken,
        });
      expect(response2.statusCode).toBe(200);
  
      const response3 = await request(server).post(baseUrl + "/refresh").set(
        { authorization: "JWT " + testUser.accessToken }).send({
          userId: testUser.id,
          token: testUser.refreshToken,
        });
      expect(response3.statusCode).not.toBe(200);
  
    });
  });