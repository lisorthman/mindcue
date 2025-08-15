import ballerina/http;
import ballerina/io;

configurable string news_api_key = "pub_596fef11078040f393bf7c135082fc5b";
final string base_url = "https://newsdata.io/api/1";

service / on new http:Listener(9092) {

    resource function get news() returns http:Response|error {
        http:Client newsClient = check new (base_url);
        string url = string `/news?apikey=${news_api_key}&country=lk&language=en`;
        http:Response response = check newsClient->get(url);

        json newsData = check response.getJsonPayload();
        io:println("Sri Lanka News: ", newsData.toJsonString());

        json[] topNews = [];
        if newsData is map<json> {
            json? results = newsData["results"];
            if results is json[] {
                int maxArticles = results.length() < 5 ? results.length() : 5;
                foreach int i in 0 ..< maxArticles {
                    json article = results[i];
                    if article is map<json> {
                        string title = article["title"] is string ? <string>article["title"] : "No title";
                        string link = article["link"] is string ? <string>article["link"] : "#";
                        string description = article["description"] is string ? <string>article["description"] : "No description";

                        topNews.push({
                            title: title,
                            link: link,
                            description: description
                        });
                    }
                }
            }
        }

        // Create response with CORS headers
        http:Response res = new;
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setPayload(topNews);

        return res;
    }

    // OPTIONS resource for CORS preflight
    resource function options news() returns http:Response {
        http:Response res = new;
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        return res;
    }
}
