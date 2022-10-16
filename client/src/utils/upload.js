var axios = require('axios');
// var data = JSON.stringify({
//     "pinataOptions": {
//         "cidVersion": 1
//     },
//     "pinataMetadata": {
//         "name": "testing",
//         "keyvalues": {
//             "customKey": "customValue",
//             "customKey2": "customValue2"
//         }
//     },
//     "pinataContent": {
//         "somekey": "somevalue"
//     }
// });

export const pinJSONToIPFS = async (data) => {
    // var config = {
    //     method: 'post',
    //     url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1YTc3OGVkNS05NDg2LTQ4YmEtOThjZC1jMmIxYjRkMTM3NzUiLCJlbWFpbCI6InByZW1rYXVzaGFsNjdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImU1Njc0NmRiYmNhN2Y1Y2ZjZDFjIiwic2NvcGVkS2V5U2VjcmV0IjoiMjI5YzI1NWE5YmYwYmFkNDg1YmY4YjE4N2NkY2Q3M2MyZWNmOWE2MTQ2MGI5YmY2ODJhZjhkMTIxMjA0NTA5NCIsImlhdCI6MTY2NTg2NDQyMX0.EDhHYx0oo87NWmq0cLkPSNdUpXT6pePvgFUXeSDj0qE'
    //     },
    //     data: data
    // };

    // const res = await axios(config);

    const res = await axios.post(`https://api.pinata.cloud/pinning/pinJSONToIPFS`, data, {
        maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
        headers: {
            pinata_api_key: "e56746dbbca7f5cfcd1c",
            pinata_secret_api_key: "229c255a9bf0bad485bf8b187cdcd73c2ecf9a61460b9bf682af8d1212045094",
        },
    });

    console.log(res.data);

    return res.data.IpfsHash
}

