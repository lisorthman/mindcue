import ballerina/http;
import ballerina/io;

configurable string weather_base = "https://api.openweathermap.org/data/2.5";
configurable string weather_key = "e4a3d04dc3699ab5d0a6b93bfcba7b83";
configurable string GEMINI_API_KEY = "AIzaSyAmLoB5vchgzhu44M6svzgHD_wmi5lBl-U";
configurable string SPOTIFY_CLIENT_ID = "feae4f97b7984a78a6feca4d0464b947";
configurable string SPOTIFY_CLIENT_SECRET = "8557780c00564669958c33d663358763";

service / on new http:Listener(9091) {

    resource function get recommendation/[string rawCity]() returns http:Response|error {
        http:Response res = new;

        // Set CORS headers
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        json|error result = processCity(rawCity);

        if result is error {
            res.statusCode = 500;
            res.setPayload({"error": result.message()});
        } else {
            res.setPayload(result);
        }

        return res;
    }

    // Optional: CORS preflight OPTIONS support
    resource function options recommendation/[string rawCity]() returns http:Response {
        http:Response res = new;
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        return res;
    }
}

function processCity(string rawCity) returns json|error {
    string city = rawCity;
    int? commaIndex = city.indexOf(",");
    if commaIndex is int {
        city = city.substring(0, commaIndex).trim();
    } else {
        city = city.trim();
    }
    io:println("Received city: ", rawCity, " Sanitized to: ", city);

    http:Client weatherClient = check new(weather_base);
    string path = "/weather?q=" + city + "&appid=" + weather_key + "&units=metric";

    http:Response weatherRes = check weatherClient->get(path);
    json weatherJson = check weatherRes.getJsonPayload();

    io:println("Weather JSON: ", weatherJson.toJsonString());

    if weatherJson is map<json> {
        json? weatherField = weatherJson["weather"];
        if !(weatherField is json[] && weatherField.length() > 0) {
            return error("Missing or empty 'weather' field in API response for city: " + city);
        }

        json? mainField = weatherJson["main"];
        if !(mainField is map<json>) {
            return error("Missing 'main' field in API response for city: " + city);
        }

    } else {
        return error("weatherJson is not a JSON object");
    }

    string description = check getStringValue(weatherJson, ["weather", 0, "description"]);
    float temp = check getFloatValue(weatherJson, ["main", "temp"]);

    // Temperature-based playlist keyword logic
    string playlistKeyword;
    if (temp >= 30.0) {
        playlistKeyword = "summer vibes";
    } else if (temp >= 20.0 && temp < 30.0) {
        playlistKeyword = "upbeat";
    } else if (temp >= 10.0 && temp < 20.0) {
        playlistKeyword = "cozy";
    } else if (temp < 10.0) {
        playlistKeyword = "warm acoustic";
    } else {
        // Default fallback
        playlistKeyword = "chill";
    }

    string prompt = "Weather in " + city + " is " + description + 
                    " and " + temp.toString() + "°C. Suggest a suitable activity.";

    string aiSuggestion = check callGeminiAPI(prompt);

    // Use temperature-based playlistKeyword instead of Gemini's suggestion for playlist
    string token = check getSpotifyAccessToken();
    string playlistLink = check searchSpotifyPlaylist(playlistKeyword, token);

    // Fetch Sri Lankan news here
    json slNews = check getSriLankaNews();
    io:println("DEBUG Sri Lanka news: ", slNews.toJsonString());


    return {
        city: city,
        weather: description,
        temperature: temp,
        "rawWeather": weatherJson,
        ai_suggestion: aiSuggestion,
        playlist_keyword: playlistKeyword,
        playlist_link: playlistLink,
        sri_lanka_news: slNews
    };
}


function base64Encode(string input) returns string {
    string base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    byte[] bytes = input.toBytes();
    int len = bytes.length();
    string output = "";
    int i = 0;

    while i < len {
        int byte1 = <int>bytes[i];
        int byte2 = i + 1 < len ? <int>bytes[i + 1] : 0;
        int byte3 = i + 2 < len ? <int>bytes[i + 2] : 0;

        int enc1 = byte1 >> 2;
        int enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
        int enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
        int enc4 = byte3 & 63;

        output += base64chars.substring(enc1, enc1 + 1);
        output += base64chars.substring(enc2, enc2 + 1);

        if (i + 1 < len) {
            output += base64chars.substring(enc3, enc3 + 1);
        } else {
            output += "=";
        }

        if (i + 2 < len) {
            output += base64chars.substring(enc4, enc4 + 1);
        } else {
            output += "=";
        }

        i += 3;
    }
    return output;
}


function getSpotifyAccessToken() returns string|error {
    http:Client tokenClient = check new ("https://accounts.spotify.com");

    // Prepare form body as URL-encoded string, not map!
    string formBody = "grant_type=client_credentials";

    string credentials = SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET;

    // base64 encode credentials
    string encodedCredentials = base64Encode(credentials);
    string authHeader = "Basic " + encodedCredentials;

    http:Request req = new;
    req.setHeader("Authorization", authHeader);
    req.setHeader("Content-Type", "application/x-www-form-urlencoded");
    req.setPayload(formBody);

    http:Response res = check tokenClient->post("/api/token", req);

    json response = check res.getJsonPayload();

    if response is map<json> && response["access_token"] is string {
        return <string>response["access_token"];
    }

    return error("Spotify access token not found in response");
}

// Helper: Extract nested string
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

// Helper: Extract nested float
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
        string s = val.toJsonString();
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

// Call Gemini API
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

function splitString(string str, string delimiter) returns string[] {
    string[] result = [];
    int startIndex = 0;
    int delimLen = delimiter.length();

    while (true) {
        // Find next occurrence of delimiter starting from startIndex
        int? index = str.indexOf(delimiter, startIndex);

        if index is int {
            // Extract substring from startIndex up to delimiter
            string part = str.substring(startIndex, index);
            result.push(part);
            // Update startIndex to after the delimiter
            startIndex = index + delimLen;
        } else {
            // No more delimiter found, push remaining substring and break
            string part = str.substring(startIndex);
            result.push(part);
            break;
        }
    }
    return result;
}




// Extract keyword from Gemini suggestion
function extractKeywordFromGeminiText(string text) returns string {
    int? index = text.toLowerAscii().indexOf("playlist");
    if index is int {
        string sub = text.substring(index);
        int? quoteStartOpt = sub.indexOf("\"");
        if quoteStartOpt is int {
            int? quoteEndOpt = sub.indexOf("\"", quoteStartOpt + 1);
            if quoteEndOpt is int {
                return sub.substring(quoteStartOpt + 1, quoteEndOpt);
            }
        }
    }
    return "chill"; // fallback
}

function getSriLankaNews() returns json|error {
    string newsApiKey = "pub_f20d7ab5f7424db6a9212ac7fef7b7b7";

    http:Client newsClient = check new("https://newsdata.io/api/1");

    string path = string `/news?apikey=${newsApiKey}&country=lk&language=en`;

    http:Response res = check newsClient->get(path);

    json newsData = check res.getJsonPayload();

    json[] topNews = [];

    if newsData is map<json> {
        json results = newsData["results"];
        if results is json[] {
            int maxArticles = results.length() < 5 ? results.length() : 5;

            foreach int i in 0 ..< maxArticles {
                json article = results[i];
                if article is map<json> {
                    topNews.push({
                        title: article["title"] ?: "",
                        link: article["link"] ?: ""
                    });
                }
            }
        } else {
            return error("No results array in news data");
        }
    } else {
        return error("News data is not a JSON object");
    }

    return topNews;
}





// Spotify API Call
// Manual simple string replace function (since no built-in replace)
// Helper function to replace spaces with %20 (URL encode spaces)
function replaceSpaceWithPercent20(string input) returns string {
    string output = "";
    foreach int i in 0 ..< input.length() {
        string c = input.substring(i, i + 1);
        if c == " " {
            output += "%20";
        } else {
            output += c;
        }
    }
    return output;
}

function searchSpotifyPlaylist(string keyword, string token) returns string|error {
    // Use custom replace function to encode spaces
    string encodedKeyword = replaceSpaceWithPercent20(keyword);

    string searchUrl = "/v1/search?q=" + encodedKeyword + "&type=playlist&limit=5";

    // Create HTTP client without headers (base URL only)
    http:Client spotifyClient = check new ("https://api.spotify.com");

    // Create headers map to pass authorization
    map<string|string[]> headers = {
        "Authorization": "Bearer " + token
    };

    // Send GET request with URL and headers map
    http:Response res = check spotifyClient->get(searchUrl, headers);

    // Get JSON payload safely
    json|error payloadOrErr = res.getJsonPayload();
    if payloadOrErr is error {
        return payloadOrErr;
    }
    json payload = payloadOrErr;


    

    // Safely extract playlists -> items -> external_urls -> spotify link
    if payload is map<json> {
        json? playlistsOpt = payload["playlists"];
        if playlistsOpt is map<json> {
            json? itemsOpt = playlistsOpt["items"];
            if itemsOpt is json[] && itemsOpt.length() > 0 {
                json firstItem = itemsOpt[0];
                if firstItem is map<json> {
                    json? extUrlsOpt = firstItem["external_urls"];
                    if extUrlsOpt is map<json> {
                        json? spotifyUrlOpt = extUrlsOpt["spotify"];
                        if spotifyUrlOpt is string {
                            return spotifyUrlOpt;
                        }
                    }
                }
            }
        }
    }

    return "https://open.spotify.com/playlist/3MmYXlR3mdDEshGy3Lr2pN?si=96c7fdba55d44976"; 
    }