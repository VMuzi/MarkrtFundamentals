import axiosService from "./common";
import { config } from "../../config";

const newsService = {
    GetEverything: async function(url,apiKey,endpoint,keyword,searchIn,sources,domains,
        excludeDomains,fromDate,toDate,language,sortBy,pageSize,page){
        var params = {};

        if(keyword){
            params.q = keyword;
        }

        if(searchIn){
            params.searchIn = searchIn;
        }

        if(sources){
            params.sources = sources;
        }

        if(domains){
            params.domains = domains;
        }

        if(excludeDomains){
            params.excludeDomains = excludeDomains;
        }

        if(fromDate){
            params.from = fromDate;
        }

        if(toDate){
            params.to = toDate;
        }

        if(language){
            params.language = language;
        }

        if(sortBy){
            params.sortBy = sortBy;
        }

        if(pageSize){
            params.pageSize = pageSize;
        }

        if(page){
            params.page = page;
        }
        debugger;
        params.apiKey = apiKey;
        try{
            var allNewsRes = await axiosService.Get(url,endpoint,params);
            return allNewsRes;
        }catch(err){
            console.log(err);
            return err;
        }
        
    },
    GetTopHeadLines: async function(){

    }
}

export default newsService;