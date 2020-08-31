const Blog = require('../models/blog');


const initialBlogs = [
    {
        "title": "SDASD",
        "author": "this guy",
        "url": "/asdasd/asdasd",
        "likes": 2
    }
];

const newBlog = {
    "title": "THis is an additional blog",
    "author": "This girl",
    "url": "/asd/asd/asd/ads",
    "likes": 13
};

const dbItems = async () => {
    const dbItems = await Blog.find({});
    return dbItems.map(item => item.toJSON());
};

module.exports = {
    initialBlogs,
    newBlog,
    dbItems
}