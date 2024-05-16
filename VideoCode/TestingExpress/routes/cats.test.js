import request from "supertest";
import app from "../app.js";
import cats from "../fakeDb.js";

process.env.NODE_ENV = "test"; // So that we don't see debug info

let pickles = { name: "Pickles" };

beforeEach(function () {
  cats.push(pickles);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `cats`
  cats.length = 0;
});

describe("GET /cats", () => {
  test("Get all cats", async () => {
    const res = await request(app).get("/cats");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ cats: [pickles] });
  });
});

describe("GET /cats/:name", () => {
  test("Get cat by name", async () => {
    const res = await request(app).get(`/cats/${pickles.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ cat: pickles });
  });

  test("Responds with 404 for invalid cat", async () => {
    const res = await request(app).get(`/cats/icecube`);
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /cats", () => {
  test("Creating a cat", async () => {
    const res = await request(app).post("/cats").send({ name: "Blue" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ cat: { name: "Blue" } });
  });

  test("Responds with 400 if the cat object is empty", async () => {
    const res = await request(app).post("/cats").send({});
    expect(res.statusCode).toBe(400);
  });

  test("Responds with 400 Bad Request if the 'name' field is empty or contains only spaces", async () => {
    // Test with an empty string
    let res = await request(app).post("/cats").send({ name: "" });
    expect(res.statusCode).toBe(400);

    // Test with a string containing only spaces
    res = await request(app).post("/cats").send({ name: "   " });
    expect(res.statusCode).toBe(400);
  });
});

describe("/PATCH /cats/:name", () => {
  test("Updating a cat's name", async () => {
    const res = await request(app)
      .patch(`/cats/${pickles.name}`)
      .send({ name: "Monster" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ cat: { name: "Monster" } });
  });

  test("Responds with 404 for invalid name", async () => {
    const res = await request(app)
      .patch(`/cats/Piggles`)
      .send({ name: "Monster" });
    expect(res.statusCode).toBe(404);
  });
});

describe("/DELETE /cats/:name", () => {
  test("Deleting a cat", async () => {
    const res = await request(app).delete(`/cats/${pickles.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });

  test("Responds with 404 for deleting invalid cat", async () => {
    const res = await request(app).delete(`/cats/hamface`);
    expect(res.statusCode).toBe(404);
  });
});
