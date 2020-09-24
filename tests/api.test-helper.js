const Blog = require('../models/blog');
const User = require('../models/user');


const initialBlogs = [
    {
        "title": "SDASD",
        "author": "this guy",
        "url": "/asdasd/asdasd",
        "likes": 2
    }
];


const initialUsers = [
    {
        "username": "initialUser",
        "name": "Sir Initial User",
        "password": "123456789"
    }
];

const noLikeBlog = {
    "title": "THis is an additional blog",
    "author": "This girl",
    "url": "/asd/asd/asd/ads"
};

const noTitleNoUrlBlog = {
    "author": "This girl",
    likes: 23
};

const dbItems = async () => {
    const dbItems = await Blog.find({});
    return dbItems.map(item => item.toJSON());
};

const dbUsers = async () => {
    const users = await User.find({});
    return users.map(item => item.toJSON());
};

module.exports = {
    initialUsers,
    noTitleNoUrlBlog,
    initialBlogs,
    noLikeBlog,
    dbItems,
    dbUsers
}