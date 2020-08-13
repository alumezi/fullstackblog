const dummy = (blogs) => 1;

const totalLikes = blogs => blogs.reduce((acc, curr) => acc + curr.likes, 0);

const favoriteBlog = blogs => blogs.reduce((acc, curr) => {
    if (acc.likes > curr.likes) {
        return acc
    } else {
        return curr
    }
});

const mostBlogs = blogs => {
    let occurrences = {};

    blogs.forEach(item => {
        if (occurrences[item.author]) {
            occurrences[item.author]++;
        } else {
            occurrences[item.author] = 1;
        }
    })

    let author = Object.keys(occurrences).reduce((acc, curr) => {
        if (occurrences[acc] > occurrences[curr]) {
            return acc
        } else {
            return curr
        }
    })

    return {
        author,
        blogs: occurrences[author]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}