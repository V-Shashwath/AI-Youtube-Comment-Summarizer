const util = {
    filterTimestamps: (comments) => {
        return comments.filter(comment => {
            const timestampRegex = /\d{2}:\d{2}:\d{2/;
            return !timestampRegex.test(comment.text);
        })
    }
}

export default util;