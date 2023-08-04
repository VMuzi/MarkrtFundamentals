import axiosService from "./common";

const sentimentService = {
    AnalyseExtract: async function(apiKey,endpoint,newsExtract){
        try{
            var header = {
                "apikey":  `${apiKey}`
            }
            var analysisRes = await axiosService.Post(endpoint,newsExtract,header);
            return analysisRes;
        }catch(err){
            console.log(`analysis error: ${err}`);
            return err;
        }
    }
}

export default sentimentService;