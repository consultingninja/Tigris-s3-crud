import {SECRET_AWS_SECRET_ACCESS_KEY,
        SECRET_AWS_REGION,
        SECRET_BUCKET_NAME,
        SECRET_AWS_ENDPOINT_URL_S3,
        SECRET_AWS_ACCESS_KEY_ID} from '$env/static/private';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';

const streamToString = (stream) =>
    new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
});

export async function load({}){

    try{
        const s3 = new S3Client({
            region: SECRET_AWS_REGION,
            endpoint: SECRET_AWS_ENDPOINT_URL_S3,
            credentials: {
                accessKeyId: SECRET_AWS_ACCESS_KEY_ID,
                secretAccessKey: SECRET_AWS_SECRET_ACCESS_KEY
            }
        });
        const list = new ListObjectsV2Command({
            Bucket: SECRET_BUCKET_NAME,
            MaxKeys: 10

        });
        const {Contents} = await s3.send(list);
        //console.log('List Result',Contents);
        const users = await Promise.all(Contents.map(async (item)=>{
            const getObject = new GetObjectCommand({
                Bucket: SECRET_BUCKET_NAME,
                Key: item.Key
            });
            const {Body} = await s3.send(getObject);
            const data = await streamToString(Body);
            const userObject = JSON.parse(data);
            //console.log('Data',data);
            return userObject;
        }));
        return {users};
    }
    catch(e){
        console.error(e);
    }
}