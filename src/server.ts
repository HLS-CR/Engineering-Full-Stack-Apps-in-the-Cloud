import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  // Lars Comments:

  // Updated Postman collection to use new picture since old one provides 404 and has likely been deleted:
  // https://en.bcdn.biz/Images/2018/6/12/27565ee3-ffc0-4a4d-af63-ce8731b65f26.jpg
  // Furthermore updated util.ts with a try / catch block.
  // Build server runs and Postman runs as expected, with the exception that the originally provided url is invalid and thus results in an error (see comment line 33).

  app.get("/filteredimage/", async (req, res) => {
    const imageUrl = req.query.image_url as string;

    if (!imageUrl) {
      res.sendStatus(412).send("image_url is required");
    }

    try {
      const filteredpath = await filterImageFromURL(imageUrl);
      res.sendFile(filteredpath, () => deleteLocalFiles([filteredpath]));
    } catch (err) {
      res.sendStatus(422);
    }
  });

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
