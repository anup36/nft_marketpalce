const pinataSDK = require('@pinata/sdk');
const ApiKey = "e1125dc1dafd57e867ab"; 
const SecretKey = "9fe49d9172bc847fed3ff8436d5f4c6704a173e5968356a63f978c53b8f0c83b";

const pinata = pinataSDK(ApiKey, SecretKey);
const path = require("path");

const imagePath = path.resolve("./uploads/image.png");
const jsonPath = path.resolve("./uploads/nft-data.json");

module.exports = {
    async createIpfsHash(name){ 
        try {
            let response;
            let options;

            if(name == "image"){
                options = {
                    pinataMetadata: {
                        name:  `Base NFT Created`
                    },
                    pinataOptions: {
                        cidVersion: 0
                    }
                };
                response = await pinata.pinFromFS(imagePath, options);

            } else {
                options = {
                    pinataMetadata: {
                        name: `${name} NFT Created`
                    },
                    pinataOptions: {
                        cidVersion: 0
                    }
                };  
                response = await pinata.pinFromFS(jsonPath, options);
            }

            return response;
            
        } catch (error) {
            throw error;
        }
    }   
}