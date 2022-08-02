import fs from "fs";
import Jimp = require("jimp");
import axios, { AxiosResponse } from "axios";

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
     console.log("input string is >>>>>>>>>>>", inputURL);
      const photoStream: AxiosResponse = await axios.get(
       inputURL,{
        responseType: "arraybuffer"
      });
      const photo = await Jimp.read(photoStream.data);
      console.log("Photo >>>>>>>>>>>>>>>>> ", photo);
      console.log("Dirname >>>>>>>>>>>>>>>>> ", __dirname);
      photo.write(__dirname +  "/tmp/filtered-" + photo.hash() + ".jpg");
      const outpath =
      __dirname + "/tmp/filtered" + Math.floor(Math.random() * 2000) + ".jpg";
      // const outPath =__dirname +  "/tmp/filtered-" + photo.hash() + ".jpg"
      // console.log("Path 1 >>>>>>>>>>>>>>>>> ", outpath);
      // console.log("outPath 2 >>>>>>>>>>>>>>>>> ", outPath);
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .grayscale() // set greyscale
        .write(outpath,(img) => {
          resolve(outpath)});
   
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
