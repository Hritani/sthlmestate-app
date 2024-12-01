const env = {
    API_KEY:"NTg2OnVpdDJlRmdxVG9kNlAzbVpUNzQ1bjEyS3NHR0xIa2MzdHFPT2NkTDRkNEZlQjBHdWJ1ZEVaVTB0Zlo4TXhKWWg=",
    API_URL: "https://connect.maklare.vitec.net",
    API_USER: "M19854",
    API_USERNAME: "586",
    API_PASSWORD: "uit2eFgqTod6P3mZT745n12KsGGLHkc3tqOOcdL4d4FeB0GubudEZU0tfZ8MxJYh",
    NEXT_PUBLIC_STRAPI_TOKEN: "af07339454b7e40ff194347147796bacdfb505f4ebb6d8962683e672efa886ac12ac52ba5bd7f1e99fa4f4fefe8bd5095e539a6e2266b039e2e899cf472ca4e9af4894f480c9bab3943f547c93f3459e204455b48fd574a07185ba990427414e2af86979cc1e8def3e844859047dfd6d149c3a101b32218912781928d111273f"
}
module.exports = {
    apps : [
        {
            name   : "app-dev",
            script: 'npm',
            args: 'dev',
            env: {
                ...env,
                NEXT_PUBLIC_STRAPI_API_URL: "http://localhost:1337",
            }
        },
        {
            name   : "app-prod",
            script: 'npm',
            args: 'start',
            env: {
                ...env,
                NEXT_PUBLIC_STRAPI_API_URL: "https://app.deusware.se",
            }
        }
    ]
}