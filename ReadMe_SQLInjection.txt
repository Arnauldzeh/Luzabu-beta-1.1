 MongoClient object is imported from the mongodb module
 Query object contains the query parameters
 Projection object specifies the fields to be returned in the result
 Options object contains the options for the query, including collation options
 Collation options in MongoDB specify the rules for string comparison and sorting.In the code,The locale option specifies the language and region-specific rules for string comparison, while the strength option specifies the level of comparison to be used, such as primary, secondary, or tertiary.
 You can ensure that strings are compared and sorted consistently, regardless of language or character set, and prevent security vulnerabilities that can arise from inconsistent string comparison.
 The MongoClient.connect method connects to the MongoDB database using the provided uri. The collection method is used to retrieve the users collection from the mydb database. The findOne method is then called on the collection object, passing in the query, projection, and options objects as parameters. This ensures that the query is properly formatted and cannot be modified by malicious input.

