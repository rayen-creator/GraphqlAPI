const express = require('express');
const bodyParser = require('body-parser');
const express_graphql = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const morgan = require('morgan');
const app = express();
const Mutation = require('./graphql/mutation');
const Query = require('./graphql/query');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// log
app.use(morgan('tiny'));
// parse application/json
app.use(bodyParser.json());

// GraphQL schema
const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    },
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
    }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

const root = {
    course: Query.getCourse,
    courses: Query.getCourses,
    updateCourseTopic: Mutation.updateCourseTopic
};
// Create a GraphQL endpoint
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));


app.listen(3000, () => {
    console.log('Server running on port 3000');
    console.info('http://localhost:3000/graphql');
});