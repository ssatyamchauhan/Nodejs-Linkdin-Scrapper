const { Builder, By, Key, util } = require("selenium-webdriver");
const scrap = require('./scrapingjobs');
const input = require('readline-sync');


// Making a drive Object for chrome browswer
let driver = new Builder().forBrowser('chrome').build()
// Here it is opening the chrome page.
driver.get('https://www.linkedin.com/home/?originalSubdomain=in/')

let scrollAndClickSeeMore = async function () {

    try {
        // scroll up to the this element
        let scrollUpTo = await driver.findElement(By.xpath("/html/body/main/div/section/button"))
        
        // this will scroll the page scrollUpTo element
        await driver.executeScript("arguments[0].scrollIntoView(true)", scrollUpTo);
        
        // Element having list of jobs here
        let listOfJob = await  driver.findElement(By.xpath("/html/body/main/div/section/ul"))

        // Loading HTML data from the listOfJob Element
        let htmlOfJobs = await listOfJob.getAttribute("outerHTML");
        
        // scraping full Detail of company profile with jobTitle, jobDescription etc.....
        let companyDetails = await scrap.jobDetails(htmlOfJobs)
        console.log(companyDetails)

        // click on the element as soon as seen to the webpage
        await scrollUpTo.click();

        // returning true as promise is resolve
        return true
    }
    catch (err) {
        //returning false as promise is not resolve(reject)
        return false;
    }
}


let searchjobByLocation = async function () {

    // jobPosition button 
    let jobPosition = await driver.findElement(By.xpath('/html/body/main/section[1]/section/div[1]/button'))
    // click to change button as a input box
    jobPosition.click()

    // jobPositon is now input box to enter the job location
    jobPosition = await driver.findElement(By.xpath('//*[@id="JOBS"]/section[1]/input'))
    // Input for the jobTitle and location preference
    let jobTitle = input.question('Enter the jobTitle you want to search: ')
    let location = input.question('Enter your location preference: ')

    //sending keys to the browser
    jobPosition.sendKeys(jobTitle)

    // location of the jobPositon
    let jobLocation = await driver.findElement(By.xpath('//*[@id="JOBS"]/section[2]/input'))
    // bydefault there is new Delhi clearing it
    jobLocation.clear()

    //sending the lcation to the browser and clicking enter to search the desired jobs on prefered location
    await jobLocation.sendKeys(location, Key.ENTER)

    // In each 3 seconds calling the function again and again, function is working synchronously
    let myInterval = setInterval(async () => {
        // Waiting for the server response
        let booleans = await scrollAndClickSeeMore()
        // if booleans is false will stop our myInterval
        if (!booleans) clearInterval(myInterval);
    }, 3000)

}

// calling the main function where the use will ask for enter the job location and preference
searchjobByLocation()
