import config from "../../config/config";
import fs from "fs";
import CommonAbstractStorage from "../../common/commonAbstract/common.abstract.storage";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { rootFileFolder } from "../../common/middleware/uploader/uploaderConstants";

class ManageFile extends CommonAbstractStorage {
  constructor() {
    super();
  }
  // delete from cloud
  public deleteFromCloud = async (files: string[]) => {
    try {
      if (files.length) {
        for await (const file of files) {
          const deleteParams = {
            Bucket: config.AWS_S3_BUCKET,
            Key: `${rootFileFolder}/${file}`,
          };

          const res = await this.s3Client.send(
            new DeleteObjectCommand(deleteParams)
          );
          console.log({ res });
          console.log("file deleted -> ", files);
        }
      }
    } catch (err) {
      console.log({ err });
    }
  };

  // delete from local
  public deleteFromLocal = async (files: string[]) => {
    try {
      if (files.length) {
        for (let i = 0; i < files.length; i++) {
          const path = `${__dirname}/../../../${rootFileFolder}/${files[i]}`;
          await fs.promises.unlink(path);
        }
      } else {
        return;
      }
    } catch (err) {
      console.log({ err });
    }
  };

  // copy file to local
  public copyFileLocal = async (
    source: string,
    target: string,
    file: string
  ) => {
    try {
      const fileSource = `${__dirname}/../../../uploads/${source}/${file}`;
      const fileTarget = `${__dirname}/../../../uploads/${target}/${file}`;

      fs.copyFile(fileSource, fileTarget, (err) => {
        console.log(err);
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export default ManageFile;
