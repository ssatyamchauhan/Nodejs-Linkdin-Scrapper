const cheerio = require('cheerio')

module.exports = {

    jobDetails: async (htmlData) => {

        // Loading web page source into cheerio instance.
        const cheerioInstance = await cheerio.load(htmlData)

        // Declaing an array where gonna store full companyDetails.
        let companyDetails = []

        // Looping over all the li containing full Details of company.
        await cheerioInstance('ul.jobs-search__results-list li')
            .map((index, element) => {

                // jobTitle under the li inside a tag.
                let jobTitle = cheerioInstance(element).find('a.result-card__full-card-link span').text()
                // link of the main page of jobDetails.
                let link = cheerioInstance(element).find('a.result-card__full-card-link').attr('href')
                // imageLink extracting from the image tag.
                let imageLink = cheerioInstance(element).find('img').attr('src')
                // extracting company name from inside the a tag of h4 tag.
                let companyName = cheerioInstance(element).find('div > h4 > a').text()
                // extracted Location where company locate.
                let companyLocation = cheerioInstance(element).find('div > div > span').text()
                // Desciption of the post company recruiting.
                let postDescription = cheerioInstance(element).find('div > div > p').text()
                // The time of the post is posted on linkdin by company. 
                let postingTime = cheerioInstance(element).find('div > div > time').text()

                // storing the details in an array
                companyDetails.push({
                    "jobTitle": jobTitle,
                    "link": link,
                    "imageLink": imageLink,
                    "companyName": companyName,
                    "companyLocation": companyLocation,
                    "postDescription": postDescription,
                    "postingTime": postingTime
                })

            })

        return companyDetails;

    }


}
