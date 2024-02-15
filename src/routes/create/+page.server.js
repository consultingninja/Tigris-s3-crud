
import {SECRET_AWS_SECRET_ACCESS_KEY,
        SECRET_AWS_REGION,
        SECRET_BUCKET_NAME,
        SECRET_AWS_ENDPOINT_URL_S3,
        SECRET_AWS_ACCESS_KEY_ID} from '$env/static/private';
import crypto from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';


export const actions={
    create: async ({request})=>{
        const form = await request.formData();
        const firstname = form.get('firstname')?? '';
        const lastname = form.get('lastname')?? '';
        const email = form.get('email')??'';
        const password = form.get('password')??'';
        const id = crypto.randomUUID();
    
        const data = {
            firstname,
            lastname,
            email,
            password,
            id

        };
        try{
            const s3 = new S3Client({
                region: SECRET_AWS_REGION,
                endpoint: SECRET_AWS_ENDPOINT_URL_S3,
                credentials: {
                    accessKeyId: SECRET_AWS_ACCESS_KEY_ID,
                    secretAccessKey: SECRET_AWS_SECRET_ACCESS_KEY
                }
            });

            const commandDetails = new PutObjectCommand({
                Body: JSON.stringify(data),
                Bucket: SECRET_BUCKET_NAME,
                Key: email

            });

            const result = await s3.send(commandDetails);
            //console.log('Put Result',result);
        }
        catch(e){
            console.error(e);
        }

      }
}