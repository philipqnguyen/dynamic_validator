// Init dynamic input validator module.
// If a page contains the class .dynamic-validator,
// DynamicInputValidator will bind to the inputs specified
// using the options below.
//
// keyUpDelay is the delay between user typing and when AJAX request runs.
//
// selectorsAndPaths is an array of objects.
//
// The object's selector is the input selector.
//
// The object's valueFromQueries will grab the params
// from the current url string and append to the end of the url
// as a query string.
//
// The object's valueName specifies the param name for the input value
// displayed in the query string.
// For example valueName of 'dob' will equate to something like:
// '?dob=2015-06-03'
//
// The object's path is the path where the AJAX call should be made to.
//
// There should be a corresponding route & controller that returns
// true or false.
