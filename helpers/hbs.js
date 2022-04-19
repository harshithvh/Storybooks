// We need helpers to remove the p tags from the body of the story in index.hbs and to truncate the body of the story in index.hbs

module.exports = {
    truncate: function(str, len) {
        if (str.length > len && str.length > 0) { // if the length of the string is greater than the length we want to truncate it to
            let new_str = str + " " // we add a space at the end of the string
            new_str = str.substr(0, len) // The substr() method extracts a part of a string
            new_str = str.substr(0, new_str.lastIndexOf(" ")) // Using the lastIndexOf() method we can find the position of the last space in the extracted string
            new_str = new_str.length > 0 ? new_str : str.substr(0, len) // If the length of the new string is greater than 0 then we return the new string else we return the original string
            return new_str + '...' // we add the ... at the end of the string
        }
        return str
    },
    stripTags: function(input) { // we are using the stripTags() method to remove the html tags from the body of the story
        return input.replace(/<(?:.|\n)*?>/gm, '') // gm is for global match
    },
    // edit icon will show on only those stories based on the user who has logged in
    editIcon: function(storyUser, loggedUser, storyId, floating=true) {
        // toString() is used to convert the object id to string
        // the storyUser will loop through all the stories in the dashboard and will check if the user who created the story is the same as the logged in user
        if(storyUser._id.toString() == loggedUser._id.toString()) { // if the user who created the story is the same as the current logged in user
            if(floating) { // if the edit icon is floating
                return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit"></i></a>`
            } else {
                return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
            }
        } else {
            return ''
        }
    }
}