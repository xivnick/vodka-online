
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

const shuffleArray = (arr) => {
    return arr.map(a => [Math.random(), a])
        .sort((a, b) => a[0] - b[0])
        .map(a => a[1]);
};

module.exports = {
    getRandomInt,
    shuffleArray,
}