function editDistance(a, b) {
    if (a.length == 0) return b.length;
    if (b.length == 0) return a.length;

    let matrix = [];

    let i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    let j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (a.charAt(j - 1) == b.charAt(i - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
    }

    return matrix[b.length][a.length];
}
//Implement
function distance(s, t) {
    if (!s.length) return t.length;
    if (!t.length) return s.length

    return Math.min(
        distance(s.substr(1), t) + 1, //Inse
        distance(t.substr(1), s) + 1, //repla
        distance(s.substr(1), t.substr(1)) + (s[0] !== t[0] ? 1 : 0),//Delete
    )
}

module.exports = { editDistance }
