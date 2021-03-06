const BlogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

BlogRouter.get("/", async (request, response) => {
  const token = request.token;

  const decodedToken = jwt.decode(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  let blogs = await Blog.find({}).populate("user", {
    username: true,
    name: true,
  });
  try {
    response.json(blogs.map((blog) => blog));
  } catch (error) {
    response.status(404).end();
  }
});

BlogRouter.post("/", async (request, response) => {
  const body = request.body;
  const token = request.token;

  const decodedToken = jwt.decode(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user,
  });

  if (!blog.likes) {
    blog.likes = 0;
  }
  if (!blog.title && !blog.url) {
    response.status(400).end();
    return;
  }
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(blog);
});

BlogRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const token = request.token;
  const decodedToken = jwt.decode(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const blog = await Blog.findById(id);

  if (!blog) {
    return response.status(404).json({ error: "blog not found" });
  }

  if (blog.user.toString() !== decodedToken.id.toString()) {
    return response.status(401).json({ error: "wrong token" });
  }

  try {
    await blog.remove();
    response.status(204).end();
  } catch (error) {
    response.status(404).end();
  }
});

BlogRouter.put("/:id", async (request, response) => {
  const token = request.token;

  const decodedToken = jwt.decode(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const id = request.params.id;
  const record = request.body;

  const newRecord = {
    title: record.title,
    author: record.author,
    url: record.url,
    likes: record.likes,
  };

  try {
    const updatedRecord = await Blog.findByIdAndUpdate(id, newRecord, {
      new: true,
    }).populate("user", { username: true, name: true });
    response.json(updatedRecord);
  } catch (error) {
    response.status(404).end();
  }
});

BlogRouter.put("/:id/comments", async (request, response) => {
  const token = request.token;

  const decodedToken = jwt.decode(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const id = request.params.id;
  const comment = request.body.comment;

  try {
    const currentRecord = await Blog.findById(id);
    currentRecord.comments.push(comment);
    const updatedRecord = await Blog.findByIdAndUpdate(id, currentRecord, {
      new: true,
    }).populate("user", { username: true, name: true });
    response.json(updatedRecord);
  } catch (error) {
    response.status(404).end();
  }
});

module.exports = BlogRouter;
