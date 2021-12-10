export type AmplifyDependentResourcesAttributes = {
    "function": {
        "PollyTTS": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "Generator": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "api": {
        "tesis": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    }
}