import ballerina/http;
import ballerina/io;

configurable string base_url = "https://api.openweathermap.org/data/2.5";
configurable string api_key = "e4a3d04dc3699ab5d0a6b93bfcba7b83";

service /weather on new http:Listener(9090) {
    // Correct resource path definition
    resource isolated function get [string city]() returns json|error {
        string path = "/weather?q=" + city + "&appid=" + api_key + "&units=metric";
        http:Client weatherClient = check new (base_url);
        http:Response response = check weatherClient->get(path);
        json weatherData = check response.getJsonPayload();
        io:println("Weather data: ", weatherData.toJsonString());
        return weatherData;
    }
}