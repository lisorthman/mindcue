import ballerina/http;
import ballerina/io;

configurable string weather_base = "https://api.openweathermap.org/data/2.5";
configurable string weather_key = "e4a3d04dc3699ab5d0a6b93bfcba7b83";
configurable string GEMINI_API_KEY = "AIzaSyCa1w9FPEYTpSAM1XratpoOlcoH9eVFU0c";

service /recommendation on new http:Listener(9091) {

    resource function get [string city]() returns json|error {
        // 1. Fetch weather data
        http:Client weatherClient = check new(weather_base);
        string path = "/weather?q=" + city + "&appid=" + weather_key + "&units=metric";
        http:Response weatherRes = check weatherClient->get(path);
        json weatherJson = check weatherRes.getJsonPayload();

        io:println("DEBUG Weather JSON: ", weatherJson.toJsonString());

        // 2. Check for API error code
        if weatherJson is map<json> {
            if weatherJson.hasKey("cod") {
                var codVal = weatherJson["cod"];
                if codVal is int && codVal != 200 {
                    string msg = "OpenWeather API error: ";
                    if weatherJson.hasKey("message") {
                        var msgVal = weatherJson["message"];
                        if msgVal is string {
                            msg += msgVal;
                        }
                    }
                    return error(msg);
                }
            }
        }

        // 3. Extract weather description and temperature
        string description = check getStringValue(weatherJson, ["weather", 0, "description"]);
        float temp = check getFloatValue(weatherJson, ["main", "temp"]);

        io:println("DEBUG Extracted description: ", description);
        io:println("DEBUG Extracted temperature: ", temp.toString());

        // 4. Compose prompt for Gemini AI
        string prompt = "Weather in " + city + " is " + description + 
                        " and " + temp.toString() + "°C. Suggest a suitable activity and a Spotify playlist.";

        // 5. Call Gemini API to get AI recommendation
        string aiSuggestion = check callGeminiAPI(prompt);

        return {
            city: city,
            weather: description,
            temperature: temp,
            ai_suggestion: aiSuggestion
        };
    }
}

// Helper: Traverse JSON and get string value safely
function getStringValue(json j, any[] path) returns string|error {
    var current = j;
    foreach any key in path {
        if current is map<json> {
            if key is string {
                current = current[key];
            } else {
                return error("Invalid key type");
            }
        } else if current is json[] {
            if key is int {
                current = current[key];
            } else {
                return error("Invalid index type");
            }
        } else {
            return error("Path not found");
        }
    }
    if current is string {
        return current;
    }
    return error("Value is not a string");
}

// Helper: Traverse JSON and get float value safely, with robust parsing
function getFloatValue(json j, any[] path) returns float|error {
    var current = j;
    foreach any key in path {
        if current is map<json> {
            if key is string {
                current = current[key];
            } else {
                return error("Invalid key type");
            }
        } else if current is json[] {
            if key is int {
                current = current[key];
            } else {
                return error("Invalid index type");
            }
        } else {
            return error("Path not found");
        }
    }
    io:println("DEBUG getFloatValue found JSON node: ", current.toJsonString());

    float|error f = jsonToFloat(current);
    if f is float {
        return f;
    }
    return error("Value is not a number");
}

// Convert JSON number or string to float robustly
function jsonToFloat(json val) returns float|error {
    io:println("DEBUG jsonToFloat received: ", val.toJsonString());

    if val is float {
        return val;
    } else if val is int {
        return <float>val;
    } else if val is string {
        var parsed = float:fromString(val);
        if parsed is float {
            return parsed;
        }
    } else {
        // Fallback: try parsing string form of JSON value
        string s = val.toJsonString();
        // Remove surrounding quotes if any (e.g., if JSON string)
        if s.startsWith("\"") && s.endsWith("\"") {
            s = s.substring(1, s.length() - 1);
        }
        var parsed = float:fromString(s);
        if parsed is float {
            return parsed;
        }
    }

    return error("Cannot convert json to float");
}

// Call Gemini API with prompt, return suggestion string
function callGeminiAPI(string promptText) returns string|error {
    string endpoint = "/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY;
    http:Client geminiClient = check new ("https://generativelanguage.googleapis.com");

    http:Request req = new;
    req.setHeader("Content-Type", "application/json");

    json payload = {
        contents: [{
            parts: [{
                text: promptText
            }]
        }]
    };

    req.setPayload(payload);

    http:Response response = check geminiClient->post(endpoint, req);
    json responseJson = check response.getJsonPayload();

    io:println("DEBUG Gemini API response: ", responseJson.toJsonString());

    // Validate if response contains what we expect
    if responseJson is map<json> {
    json? candidates = responseJson["candidates"];
    if candidates is json[] && candidates.length() > 0 {
        json firstCandidate = candidates[0];
        if firstCandidate is map<json> {
            json? content = firstCandidate["content"];
            if content is map<json> {
                json? parts = content["parts"];
                if parts is json[] && parts.length() > 0 {
                    json firstPart = parts[0];
                    if firstPart is map<json> {
                        json? textVal = firstPart["text"];
                        if textVal is string {
                            return textVal;
                        } else {
                            return error("text field is not string");
                        }
                    } else {
                        return error("parts[0] is not a map");
                    }
                } else {
                    return error("parts is not array or empty");
                }
            } else {
                return error("content is not a map");
            }
        } else {
            return error("candidate is not a map");
        }
    } else {
        return error("No candidates array found");
    }
} else {
    return error("Response is not a map");
}



}


