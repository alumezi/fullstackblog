const dummy = (blogs) => 1;

const totalLikes = blogs => blogs.reduce((acc, curr) => acc + curr.likes, 0);

const favoriteBlog = blogs => blogs.reduce((acc, curr) => {
    if (acc.likes > curr.likes) {
        return acc
    } else {
        return curr
    }
});

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}