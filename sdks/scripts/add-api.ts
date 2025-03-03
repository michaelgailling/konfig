import inquirer from "inquirer";
import path from "path";
import * as fs from "fs";
import autocomplete from "inquirer-autocomplete-standalone";
import boxen from "boxen";
import yaml from "js-yaml";
import { PublishJson as PublishJsonType } from "../src/publish-json-schema";
import Instructor from "@instructor-ai/instructor";
import { z } from "zod";
import OpenAI from "openai";
import snakeCase from "lodash.snakecase";
import { generateSdkDynamicPath } from "./util";
import { fetchFaviconAndSaveToFile } from "../src/fetch-favicon-and-save-to-file";
import axios from "axios";
import { fileTypeFromBuffer } from "file-type";
import os from "os";
import kebabCase from "lodash.kebabcase";
import camelCase from "camelcase";
import {
  getCompanyDescriptionFromApolloIo,
  getCompanyNameFromApolloIo,
  getKeywordsFromApolloIo,
} from "./get-from-apollo";

const ROOT_FOLDER_PATH = path.dirname(__dirname);
const DB_FOLDER_PATH = path.join(ROOT_FOLDER_PATH, "db");
const SPEC_DATA_FOLDER_PATH = path.join(DB_FOLDER_PATH, "spec-data");

async function main() {
  await addApiToPublish();
}

/**
 * Adds an API to the list of APIs to publish in publish.yaml.
 *
 * 1. Ask to add one of the JSONs under db/spec-data
 * 2. Ask for a company, homepage.
 * 3. If spec-data JSON does not include categories, ask for categories (use AI to suggest category)
 * 4. If serviceName is not available from spec-data, ask if you would like to add one
 * 4 a. If yes, ask for serviceName
 * 4 b. If no, ask for a serviceName
 * 5. If serviceName is available, ask if you would like to remove it
 * 5 a. If yes, set serviceName to false
 * 5 b. If no, do nothing
 * 6. If a meta description is available from data-from-html.json, ask if you would like to add it
 * 6 a. If yes, add metaDescription from data-from-html.json
 * 6 b. If no, move to (7)
 * 7. If a meta description is not available from data-from-html.json,
 * 7 a. Generate description using AI and ask if you would like to add it
 * 7 a i. If yes, add description
 * 7 a ii. If no, ask for manual input for description
 * 8. Create folder under openapi-examples based on company name and service name [see generateSdkDynamciPath()]
 * 9. Automatically get favicon from homepage and save to file under openapi-examples
 * 10. Ask for URL to logo and save to file under openapi-examples
 * 11. Check if imagePreview.png is available in openapi-examples
 * 11 a. If yes, move on
 * 11 b. If no, wait for imagePreview.png to exist in openapi-examples
 * 12. Generate sdkName based on company name and service name
 * 13. Generate clientName based on company name and service name.
 * 14. Ask if you want to overwrite the apiDescription
 */
async function addApiToPublish() {
  // (1)
  const api = await chooseApiFromSpecData();

  // (2)
  const homepage = PublishJson.getHomepage(api) ?? (await getHomepage());
  PublishJson.saveHomepage({ homepage }, api);
  console.log(`✅ Homepage: ${PublishJson.getHomepage(api)}`);

  const company = PublishJson.getCompany(api) ?? (await getCompany(homepage));
  PublishJson.saveCompany({ company }, api);
  console.log(`✅ Company: ${company}`);

  // NEW
  const developerDocumentation =
    PublishJson.getDeveloperDocumentation(api) ??
    (await getDeveloperDocumentation());
  PublishJson.saveDeveloperDocumentation({ developerDocumentation }, api);
  console.log(
    `✅ Developer Documentation: ${PublishJson.getDeveloperDocumentation(api)}`
  );

  // NEW
  const apiStatusUrls =
    PublishJson.getApiStatusUrls(api) ?? (await getApiStatusUrls());
  PublishJson.saveApiStatusUrls({ apiStatusUrls }, api);
  console.log(`✅ API Status URLs: ${PublishJson.getApiStatusUrls(api)}`);

  // (6) & (7)
  const metaDescription =
    PublishJson.getMetaDescription(api) ??
    (await getMetaDescription(api, company, homepage));
  if (metaDescription !== null) {
    PublishJson.saveMetaDescription({ metaDescription }, api);
    console.log(`✅ Meta Description: ${metaDescription}`);
  } else {
    console.log("✅ Meta Description: (skipped)");
  }

  // (3)
  const categories =
    PublishJson.getCategories(api) ??
    (await getCategories(api, company, metaDescription, homepage));
  PublishJson.saveCategories({ categories }, api);
  console.log(`✅ Categories: ${PublishJson.getCategories(api)}`);

  // (4) & (5)
  const serviceName =
    PublishJson.getServiceName(api) ?? (await getServiceName(api));
  PublishJson.saveServiceName({ serviceName }, api);
  console.log(`✅ Service Name: ${PublishJson.getServiceName(api)}`);

  // (8)
  const companyServicePath = createDirectoryUnderOpenApiExamples(
    company,
    serviceName === false ? undefined : serviceName
  );

  // (9)
  await fetchFaviconAndSaveToFile({
    destination: companyServicePath,
    domain: homepage,
  });

  // (10)
  await ensureLogoExists(homepage, companyServicePath);

  // (11)
  await ensureImagePreviewExists(homepage, companyServicePath);

  // (12) & (13)
  const sdkName = getSdkName(
    company,
    serviceName === false ? undefined : serviceName
  );
  const clientName = getClientName(
    company,
    serviceName === false ? undefined : serviceName
  );
  PublishJson.saveSdkName({ sdkName }, api);
  PublishJson.saveClientName({ clientName }, api);
  console.log(`✅ SDK Name: ${sdkName}`);
  console.log(`✅ Client Name: ${clientName}`);

  // (14)
  // const apiDescription = await getApiDescription(api);
  // if (apiDescription.length > 0) {
  //   PublishJson.saveApiDescription({ apiDescription }, api);
  //   console.log(`✅ Overwrote API Description: ${apiDescription}`);
  // }
}

function getSpecData(api: string): any {
  return JSON.parse(
    fs.readFileSync(path.join(SPEC_DATA_FOLDER_PATH, `${api}.json`), "utf-8")
  );
}

function createDirectoryUnderOpenApiExamples(
  company: string,
  serviceName?: string
) {
  const dynamicPath = generateSdkDynamicPath(company, serviceName);
  const openApiExamplesPath = path.join(ROOT_FOLDER_PATH, "openapi-examples");
  const companyServicePath = path.join(openApiExamplesPath, dynamicPath);
  if (!fs.existsSync(companyServicePath)) {
    fs.mkdirSync(companyServicePath, { recursive: true });
  }
  return companyServicePath;
}

async function getApiDescription(api: string): Promise<string> {
  // confirm if you want to overwrite the apiDescription
  const confirmOverwrite = await inquirer.prompt({
    type: "confirm",
    name: "confirmOverwrite",
    message: "Would you like to overwrite the API description?",
  });

  // ask if you want to overwrite the apiDescription and open an editor to edit the description
  if (!confirmOverwrite.confirmOverwrite) return "";
  const apiDescription = await inquirer.prompt({
    type: "editor",
    name: "apiDescription",
    message: "Provide the updated API description",
  });
  return apiDescription.apiDescription;
}

function getSdkName(company: string, serviceName?: string) {
  if (!serviceName) {
    return `${kebabCase(company)}-{language}-sdk`;
  }
  return `${kebabCase(company)}-${kebabCase(serviceName)}-{language}-sdk`;
}

function getClientName(company: string, serviceName?: string) {
  const result = !serviceName
    ? camelCase(company, { pascalCase: true })
    : camelCase(`${company} ${serviceName}`, { pascalCase: true });
  // if result starts with a number, add a "Client" prefix
  if (result.startsWith("number")) {
    return `Client${result}`;
  }
  return result;
}

async function ensureImagePreviewExists(
  homepage: string,
  companyServicePath: string
) {
  // if file with name "imagePreview.png" exists, then return
  const files = fs.readdirSync(companyServicePath);
  const imagePreviewFiles = files.filter((file) =>
    file.startsWith("imagePreview")
  );
  if (imagePreviewFiles.length > 0) {
    return;
  }
  console.log(`🔗 Take a screen shot from: https://${homepage}`);
  console.log(
    `🔗 Or take something from google images: https://www.google.com/search?q=${homepage}&sca_esv=8b94fdf9c54254b4&udm=2&sxsrf=ACQVn0-dkmzkin3gOWPkD3hG2Lua1nYGfA:1710040201133&source=lnt&tbs=isz:l&uds=AMwkrPvqGo5zoYGWt6LNDCHlwCLepPBUhib_mmmsktE8LFd5wbAdg2JVjvHdD72sKly-br_l--4v8i6J09G-3Jjmxp7j72gjiiZp_FaH-MGujWfYzLCZoo8&sa=X&ved=2ahUKEwiSwPWV3OiEAxW9HjQIHYyBCVoQpwV6BAgDEAc&biw=1338&bih=924&dpr=2`
  );

  // ask if screen shot has been taken
  const image = (
    await inquirer.prompt({
      type: "input",
      name: "image",
      message: `Provide a URL if you found an image online or "y" if you took a screenshot?`,
    })
  ).image;

  if (image === "y") {
    // Find latest screenshot under user's Downloads folder
    const downloadPath = path.join(os.homedir(), "Downloads");
    const downloadFiles = fs.readdirSync(downloadPath);
    const screenshotFiles = downloadFiles.filter(
      (file) => file.endsWith(".png") || file.endsWith(".jpg")
    );
    if (screenshotFiles.length === 0) {
      console.log("❌ No screenshot found in Downloads folder");
      return;
    }
    // sort screenshotFiles by date modified
    screenshotFiles.sort((a, b) => {
      const aStats = fs.statSync(path.join(downloadPath, a));
      const bStats = fs.statSync(path.join(downloadPath, b));
      return bStats.mtimeMs - aStats.mtimeMs;
    });

    const latestScreenshot = screenshotFiles[0];
    const screenshotPath = path.join(downloadPath, latestScreenshot);
    const destinationPath = path.join(companyServicePath, "imagePreview.png");
    fs.copyFileSync(screenshotPath, destinationPath);
  } else {
    await getAndSaveLogo(image, companyServicePath, "imagePreview");
  }
}

async function ensureLogoExists(homepage: string, companyServicePath: string) {
  // if file with name that starts with "logo" exists, then return
  const files = fs.readdirSync(companyServicePath);
  const logoFiles = files.filter((file) => file.startsWith("logo"));
  if (logoFiles.length > 0) {
    return;
  }
  console.log(
    `🔎: https://www.google.com/search?q=${encodeURIComponent(
      `${homepage} logo`
    )}&tbm=isch&tbs=ic:trans&prmd=invmbstz&hl=en&sa=X&ved=0CAMQpwVqFwoTCIDdm5bfu4QDFQAAAAAdAAAAABAI&biw=1338&bih=924`
  );
  const logoUrl = await inquirer.prompt({
    type: "input",
    name: "logoUrl",
    message: "What is the URL to the logo?",
  });
  await getAndSaveLogo(logoUrl.logoUrl, companyServicePath, "logo");
}

async function getAndSaveLogo(
  url: string,
  companyServicePath: string,
  fileName: string
) {
  // get logo image, determine file type, and save to file
  const response = await axios.get(url, {
    responseType: "arraybuffer",
    headers: {
      "Accept-Encoding": "gzip",
    },
  });
  const buffer = Buffer.from(response.data, "binary");
  const ext = await getFileTypeFromBuffer(buffer);
  const logoPath = path.join(companyServicePath, `${fileName}.${ext}`);
  fs.writeFileSync(logoPath, buffer);
}

async function getFileTypeFromBuffer(buffer: Buffer): Promise<string> {
  const fileType = await fileTypeFromBuffer(buffer);
  if (!fileType) {
    throw new Error("Could not determine file type");
  }
  if (fileType.ext === "xml") {
    return "svg";
  }
  return fileType.ext;
}

async function getMetaDescription(
  api: string,
  companyName: string,
  domain: string
): Promise<string | null> {
  const descriptionFromApollo = await getCompanyDescriptionFromApolloIo(domain);

  if (descriptionFromApollo) {
    console.log("🟢 Found description from Apollo.io");
    console.log(
      boxen(descriptionFromApollo, { title: "Description (✨ Apollo)" })
    );
    const useDescriptionFromApollo = await inquirer.prompt({
      type: "confirm",
      name: "useDescriptionFromApollo",
      message: "Would you like to use the description from Apollo?",
    });
    if (useDescriptionFromApollo.useDescriptionFromApollo) {
      return descriptionFromApollo;
    }
  }

  const oai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const client = Instructor({ client: oai, mode: "FUNCTIONS" });
  console.log("🧠 Generating meta description using AI...");
  const { description } = await client.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `
        Can you give me a description of ${companyName}. Just give me the description and don't prefix it with anything. The response should only include the description. Add some more detail in the description. DO NOT add quotes (") in the response as it is USELESS. Do not repeat yourself in the beginning of the response (e.g. "${companyName}, ${companyName}"). Here are some existing examples of descriptions for other companies:

        "Lob", "Lob provides a suite of APIs to deliver mail, including address verification, mail tracking, and more. Our print & mail API is used by companies large and small to send postcards, letters, and checks."
        "UniCourt", "UniCourt is a leader in making court data more accessible and useful. We provide real-time access to court data from state, federal, and local courts, as well as analytics, case management, and automation tools for legal professionals.
        "Vimeo", "Join the world's leading professional video platform and grow your business with easy-to-use, high-quality video creation, hosting, and marketing tools.
        "Zapier", "AI Actions is a tool for builders to equip AI platforms (or custom integrations) with the ability to run any Zapier action! The 20,000+ searches and actions you know and love from the Zapier automation platform can be used with your favorite AI tool."
        "Open Banking", "The trusted technology that connects banks, fintechs & technical providers - technology that's helping 6m users take control of their money.
        "Notion", "Notion is a new tool that blends your everyday work apps into one. It's the all-in-one workspace for you and your team.
        "Ably", "Ably provides a suite of APIs to build, extend, and deliver powerful digital experiences in realtime. Organizations like Toyota, Bloomberg, HubSpot, and Hopin depend on Ably’s platform to offload the growing complexity of business-critical realtime data synchronization at global scale.
        "WhatsApp", "Use WhatsApp Messenger to stay in touch with friends and family. WhatsApp is free and offers simple, secure, reliable messaging and calling, available on phones all over the world.
        "Wikimedia", "Wikimedia is a global movement whose mission is to bring free educational content to the world.
        "Trello", "Trello is a collaboration tool that organizes your projects into boards. In one glance, Trello tells you what's being worked on, who's working on what, and where something is in a process.
        "The New York Times", "Live news, investigations, opinion, photos and video by the journalists of The New York Times from more than 150 countries around the world. Subscribe for coverage of U.S. and international news, politics, business, technology, science, health, arts, sports and more.
        "GoDaddy", "All the help and tools you need to grow online: Websites, Domains, Digital and Social Marketing - plus GoDaddy Guides with you every step of the way.
        "Ticketmaster", "Tap into the Ticketmaster open developer network which gives you the flexibility and scale to bring unforgettable live events to fans. It’s our technology – your way."
        "Stack Exchange", "We make Stack Overflow and 170+ other community-powered Q&A sites.
        "Spotify", "Spotify is a digital music service that gives you access to millions of songs.
        "Shutterstock", "Download the best royalty free images from Shutterstock, including photos, vectors, and illustrations. Enjoy straightforward pricing and simple licensing.
        "Rotten Tomatoes", "Rotten Tomatoes, home of the Tomatometer, is the most trusted measurement of quality for Movies & TV. The definitive site for Reviews, Trailers, Showtimes, and Tickets.
        "Postmark", "Send transactional and marketing emails and get them to the inbox on time, every time. Postmark is a fast and reliable email delivery service for developers.
        "Paylocity", "Paylocity is the HR & Payroll provider that frees you from the tasks of today, so together, we can spend more time focused on the promise of tomorrow.
        "Qualtrics", "Know what your customers and employees need, when they need it, and deliver it every time with powerful, AI driven Experience Management (XM) software.
        "SoundCloud", "Discover and play over 320 million music tracks. Join the world’s largest online community of artists, bands, DJs, and audio creators.
        "Snyk", "Snyk helps software-driven businesses develop fast and stay secure. Continuously find and fix vulnerabilities for npm, Maven, NuGet, RubyGems, PyPI and more.
        "Walmart", "Walmart is the world's largest retailer, and the Walmart Open API provides access to our extensive product catalog, thus enabling digital businesses to create new and innovative shopping experiences.`,
      },
    ],
    model: "gpt-3.5-turbo",
    response_model: {
      schema: z.object({ description: z.string() }),
      name: "Description",
    },
  });

  console.log(boxen(description, { title: "Description (✨ AI)" }));

  const useGeneratedDescription = await inquirer.prompt({
    type: "confirm",
    name: "useGeneratedDescription",
    message: "Would you like to use the generated description?",
  });

  if (useGeneratedDescription.useGeneratedDescription) {
    return description;
  }

  const manualDescription = await inquirer.prompt({
    type: "input",
    name: "manualDescription",
    message: "What is the description?",
  });
  return manualDescription.manualDescription;
}

async function getServiceName(api: string): Promise<string | false> {
  const specData = getSpecData(api);
  if (specData.serviceName) {
    console.log("Found serviceName in spec data");
    const removeServiceName = await inquirer.prompt({
      type: "confirm",
      name: "removeServiceName",
      message: "Would you like to remove the service name?",
    });
    return removeServiceName.removeServiceName ? false : specData.serviceName;
  }
  console.log("⚪️ Service name not found in spec data");
  const serviceName = await inquirer.prompt({
    type: "input",
    name: "serviceName",
    message: "What is the service name? (e.g. enter nothing to set as false)",
  });
  return serviceName.serviceName.length > 0 ? serviceName.serviceName : false;
}

async function getCategories(
  api: string,
  companyName: string,
  metaDescription: string | null,
  homepage: string
): Promise<string[]> {
  // const specData = getSpecData(api);
  // if (specData.categories) {
  //   console.log("🟢 Found categories in spec data");
  //   return specData.categories;
  // }

  const publishJson: PublishJsonType = yaml.load(
    fs.readFileSync(path.join(ROOT_FOLDER_PATH, "publish.yaml"), "utf-8")
  ) as PublishJsonType;

  const allCategories = [
    ...new Set(
      Object.values(publishJson.publish).reduce((acc, curr) => {
        if (curr.categories !== undefined && Array.isArray(curr.categories)) {
          return [...acc, ...curr.categories];
        }
        return acc;
      }, [] as string[])
    ),
  ];

  console.log("⚪️ Did not find categories in spec data");

  console.log(
    boxen(allCategories.join("\n"), {
      padding: 1,
      title: "Existing Categories",
    })
  );

  const categoriesSchema = z.object({
    matchingCategories: z.string().array(),
    newCategories: z.string().array().optional(),
  });

  const oai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const client = Instructor({ client: oai, mode: "FUNCTIONS" });

  const prompt = `

${
  metaDescription != null
    ? `Here is a description of the company: "${metaDescription}".`
    : ""
}

Here are existing categories: ${allCategories.join(", ")}.

  What are the categories for the company "${companyName}"? Try to match "${companyName}" to existing categories or if there are new categories then please list them. Do not provide duplicate categories. Provide all categories in snake_case. Do not use special characters like "&".`;

  const { matchingCategories, newCategories } =
    await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-3.5-turbo",
      response_model: { schema: categoriesSchema, name: "Categories" },
    });

  if (matchingCategories.length > 0) {
    console.log(
      boxen(matchingCategories.join("\n"), { title: "Matching (✨ AI)" })
    );
  }
  if (newCategories && newCategories.length > 0) {
    console.log(boxen(newCategories.join("\n"), { title: "New (✨ AI)" }));
  }

  const keywords = await getKeywordsFromApolloIo(homepage);
  const keywordsSnakeCase = keywords?.map(snakeCase);

  if (keywordsSnakeCase) {
    console.log(
      boxen(keywordsSnakeCase.join("\n"), {
        title: "Keywords (✨ Apollo)",
      })
    );
  }

  const foundCategories = Array.from(
    new Set([
      ...matchingCategories,
      ...(newCategories ?? []),
      ...(keywordsSnakeCase ?? []),
    ])
  );

  const selectedCategories = (
    await inquirer.prompt({
      type: "checkbox",
      name: "selectedCategories",
      message: "Select the categories",
      choices: foundCategories,
    })
  ).selectedCategories;

  const categories = (
    await inquirer.prompt({
      type: "input",
      name: "categories",
      message:
        "Want to add any new categories? (pass multiple categories as comma separated list)",
    })
  ).categories;
  const allSelectedCategories = [
    ...selectedCategories,
    ...(categories === ""
      ? []
      : categories.split(",").map((category: string) => category.trim())),
  ];
  const deduplicatedCategories = Array.from(new Set(allSelectedCategories));
  const finalCategories = deduplicatedCategories.map(snakeCase);
  console.log("✅ Selected Categories: ", finalCategories.join(", "));
  return finalCategories;
}

async function getHomepage(): Promise<string> {
  const homepage: string = (
    await inquirer.prompt({
      type: "input",
      name: "homepage",
      message: "What is the homepage?",
    })
  ).homepage;
  // remove "https://" or "http://" from the beginning of the string
  return homepage.replace(/^(https?:\/\/)/, "");
}

async function getDeveloperDocumentation(): Promise<string> {
  const developerDocumentation: string = (
    await inquirer.prompt({
      type: "input",
      name: "developerDocumentation",
      message: "What is the URL for developer documentation?",
    })
  ).developerDocumentation;
  // remove "https://" or "http://" from the beginning of the string
  return developerDocumentation.replace(/^(https?:\/\/)/, "");
}

async function getApiStatusUrls(): Promise<string[] | false | "inherit"> {
  const apiStatusUrls: string = (
    await inquirer.prompt({
      type: "input",
      name: "apiStatusUrls",
      message: `What URLs should we check for API Status? Enter as a comma separated list. (e.g. enter nothing to disable API status checks for this API or "i" to use URLs from OpenAPI specification)`,
    })
  ).apiStatusUrls;

  if (apiStatusUrls === "i") {
    return "inherit";
  }

  if (apiStatusUrls.length === 0) {
    return false;
  }

  const urls = apiStatusUrls.split(",").map((url) => url.trim());

  // ensure https://" or "http://" are at beginning of the string
  const urlWithProtocol = urls.map((url) => {
    if (!/^https?:\/\//i.test(url)) {
      return "https://" + url;
    }
    return url;
  });
  return urlWithProtocol;
}

async function getCompany(homepage: string): Promise<string> {
  const companyName = await getCompanyNameFromApolloIo(homepage);

  if (companyName !== undefined) {
    console.log("🟢 Found company name from Apollo.io");
    console.log(boxen(companyName, { title: "Company Name (✨ Apollo)" }));
    const useCompanyNameFromApollo = await inquirer.prompt({
      type: "confirm",
      name: "useCompanyNameFromApollo",
      message: "Would you like to use the company name from Apollo?",
    });
    if (useCompanyNameFromApollo.useCompanyNameFromApollo) {
      return companyName;
    }
  }

  return (
    await inquirer.prompt({
      type: "input",
      name: "company",
      message: "What is the company?",
    })
  ).company;
}

async function chooseApiFromSpecData(): Promise<string> {
  // Find all the JSONs under db/spec-data
  const specDataFiles = fs.readdirSync(SPEC_DATA_FOLDER_PATH);
  const specDataChoices = specDataFiles.map((file) => {
    // remove .json from end of file name
    const withoutExtension = file.replace(".json", "");
    return {
      name: withoutExtension,
      value: withoutExtension,
    };
  });
  const apiSpec = await autocomplete({
    message: "Which spec for what API would you like to add?",
    source: async (input) => {
      if (!input) {
        return specDataChoices;
      }
      return specDataChoices.filter((choices) => {
        return choices.name.includes(input);
      });
    },
  });
  return apiSpec;
}

class PublishJson {
  static PATH = path.join(ROOT_FOLDER_PATH, "publish.yaml");

  static getCompany(api: string): string | undefined {
    return PublishJson._currentPublishJson().publish[api]?.company;
  }

  static getHomepage(api: string): string | undefined {
    return PublishJson._currentPublishJson().publish[api]?.homepage;
  }

  static getDeveloperDocumentation(api: string): string | undefined {
    return PublishJson._currentPublishJson().publish[api]
      ?.developerDocumentation;
  }

  static getApiStatusUrls(
    api: string
  ): string[] | false | "inherit" | undefined {
    return PublishJson._currentPublishJson().publish[api]?.apiStatusUrls;
  }

  static getCategories(api: string): string[] | undefined {
    return PublishJson._currentPublishJson().publish[api]?.categories;
  }

  static getClientName(api: string): string | undefined {
    return PublishJson._currentPublishJson().publish[api]?.clientName;
  }

  static getServiceName(api: string): string | false | undefined {
    return PublishJson._currentPublishJson().publish[api]?.serviceName;
  }

  static getMetaDescription(api: string): string | undefined {
    return PublishJson._currentPublishJson().publish[api]?.metaDescription;
  }

  static getSdkName(api: string): string | undefined {
    return PublishJson._currentPublishJson().publish[api]?.sdkName;
  }

  static saveApiDescription = this._writeToDiskAfter(
    ({ apiDescription }: { apiDescription: string }, progress) => {
      progress.apiDescription = apiDescription;
    }
  );

  static saveSdkName = this._writeToDiskAfter(
    ({ sdkName }: { sdkName: string }, progress) => {
      progress.sdkName = sdkName;
    }
  );

  static saveMetaDescription = this._writeToDiskAfter(
    ({ metaDescription }: { metaDescription: string }, progress) => {
      progress.metaDescription = metaDescription;
    }
  );

  static saveServiceName = this._writeToDiskAfter(
    ({ serviceName }: { serviceName: string | false }, progress) => {
      progress.serviceName = serviceName;
    }
  );

  static saveCompany = this._writeToDiskAfter(
    ({ company }: { company: string }, progress) => {
      progress.company = company;
    }
  );

  static saveHomepage = this._writeToDiskAfter(
    ({ homepage }: { homepage: string }, progress) => {
      progress.homepage = homepage;
    }
  );

  static saveDeveloperDocumentation = this._writeToDiskAfter(
    (
      { developerDocumentation }: { developerDocumentation: string },
      progress
    ) => {
      progress.developerDocumentation = developerDocumentation;
    }
  );

  static saveApiStatusUrls = this._writeToDiskAfter(
    (
      { apiStatusUrls }: { apiStatusUrls: string[] | false | "inherit" },
      progress
    ) => {
      progress.apiStatusUrls = apiStatusUrls;
    }
  );

  static saveCategories = this._writeToDiskAfter(
    ({ categories }: { categories: string[] }, progress) => {
      progress.categories = categories;
    }
  );

  static saveClientName = this._writeToDiskAfter(
    ({ clientName }: { clientName: string }, progress) => {
      progress.clientName = clientName;
    }
  );

  static _currentPublishJson(): PublishJsonType {
    return yaml.load(fs.readFileSync(this.PATH, "utf-8")) as PublishJsonType;
  }

  /**
   * Decorator for ensuring that the progress is written to disk after the lambda is called.
   */
  static _writeToDiskAfter<T>(
    lambda: (
      args: T,
      progress: Partial<PublishJsonType["publish"]["specData"]>
    ) => void
  ): (args: T, specData: string) => void {
    return (args: T, specData) => {
      const publishJson = PublishJson._currentPublishJson();
      if (publishJson.publish === undefined) {
        publishJson.publish = {};
      }
      if (publishJson.publish[specData] === undefined) {
        publishJson.publish[specData] = {} as any;
      }
      lambda(args, publishJson.publish[specData]);
      fs.writeFileSync(this.PATH, yaml.dump(publishJson));
    };
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
