const mongoose = require('mongoose');

const defoultRequirements = {
    required: true,
    unique: true,
    type: String,
}

const requirementsWithoutUnique = {
    required: true,
    type: String
}

const defaultMoiveRequierments = {
    type: String,
    defalt: "Unknown"
}

const UserSchema = new mongoose.Schema({
    firstName: requirementsWithoutUnique,
    lastName: requirementsWithoutUnique,
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    movies: [{
        Id: defaultMoiveRequierments,
        imdbID: requirementsWithoutUnique,
        Title: requirementsWithoutUnique,
        Genre: [requirementsWithoutUnique],
        Plot: requirementsWithoutUnique,
        Writer: requirementsWithoutUnique,
        Rated: requirementsWithoutUnique,
        Director: requirementsWithoutUnique,
        Actors: [requirementsWithoutUnique],
        Production: requirementsWithoutUnique,
        Poster: requirementsWithoutUnique,
        Year: {
            type: Date,
            defalt: null
        },
        Released: {
            type: Date,
            defalt: null
        },
        Runtime: {
            type: Number,
            defalt: null
        },
        Type: {
            type: String,
            required: true
        },
        Ratings: [{
            Source: {
                type: String
            },
            Value: {
                type: String,
                default: '0'
            }
        }],
        Watched: {
            type: Date,
            default: Date.now
        },
        WatchedStatus: {
            type: Boolean,
        }
    }],
    accountData: {
        accountType: {
            type: String,
            default: 'basic'
        },
        secretToken: {
            type: String
        },
        verifiedEmail: {
            type: Boolean
        }

    }

}, {
    timestamps: true
});

const User = mongoose.model('user', UserSchema);

module.exports = User