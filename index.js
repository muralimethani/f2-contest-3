const request=require('request');
var cheerio = require("cheerio");
const fs = require('fs');

var result=[];

function handleRequest(err,data){
    if(err){
        console.log("Error in fetching data.");
    }

    var $ = cheerio.load(data.body);

    $(".Box-row").each((index,el) => {
        result.push({title : $(el).find('.h3').text().replace(/\s\s+/g,''),
        description : $(el).find('p').text().trim(),
        url : $(el).find('.h3 a').attr('href'),
        stars : $(el).find(".f6 a:nth-of-type(1)").text().trim(),
        forks : $(el).find(".f6 a:nth-of-type(2)").text().trim(),
        language : $(el).find(".repo-language-color + span").text()
    });
    });

    console.log("Respositories:",result);

    fs.writeFile('repo_data.json', JSON.stringify(result), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Data saved to repo_data.json");
        }
    });
    
}

request("https://github.com/trending",handleRequest);


var devResult=[];

function devHandleRequest(err,data){

    if(err){
        console.log("Error in fetching data");
    }

    var $ = cheerio.load(data.body);

    $(".Box-row").each((index,el) => {
        devResult.push({
            devName : $(el).find(".h3").text().replace(/\s\s+/g,''),
            devUserName : $(el).find("p > a").text().trim(),
            repoName : $(el).find(".color-fg-muted + h1").text().trim(),
            description : $(el).find(".color-fg-muted + h1 + div").text().trim()
        });
    })

    console.log("Developers:",devResult);

    fs.writeFile('dev_data.json', JSON.stringify(devResult), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Data saved to dev_data.json");
        }
    });

    

}

request("https://github.com/trending/developers/javascript?since=daily",devHandleRequest)
