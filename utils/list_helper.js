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

    let author = findHighestAuthor(occurrences);

    return {
        author,
        blogs: occurrences[author]
    }
}

const mostLikes = blogs => {
    let likes = {};

    blogs.forEach(item => {
        if (likes[item.author]) {
            likes[item.author] += item.likes;
        } else {
            likes[item.author] = item.likes;
        }
    })

    let author = findHighestAuthor(likes);

    return {
        author,
        likes: likes[author]
    }
}

function findHighestAuthor(authors) {
    return Object.keys(authors).reduce((acc, curr) => {
        if (authors[acc] > authors[curr]) {
            return acc
        } else {
            return curr
        }
    })
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}