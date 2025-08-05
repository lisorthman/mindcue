import ballerina/http;
import ballerina/io;

configurable string news_api_key = "pub_f3c10ad0714840dd91670666e63ef070";
final string base_url = "https://newsdata.io/api/1";

service /news on new http:Listener(9091) {

    resource function get srilanka() returns json|error {
        // Create HTTP client with the proper base URL
        http:Client newsClient = check new (base_url);

        // Construct query parameters
        map<string> queryParams = {
            apikey: news_api_key,
            country: "lk",
            language: "en"
        };

        // Make GET request to /news endpoint with query params
        http:Response response = check newsClient->get("/news", queryParams);
        
        json newsData = check response.getJsonPayload();
        io:println("Sri Lanka News: ", newsData.toJsonString());

        return newsData;
    }
}
