import AWS from "aws-sdk"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import awsConfig from "../config/aws.config.js"
import { ApiError } from "../utils/apiError.js"
import logger from "../utils/logger.js"
import { execFileSync } from "child_process"

class S3Service {
    constructor() {
        this.s3 = awsConfig.getS3Instance()
        this.bucketName = awsConfig.getBucketName()
    }

    async uploadFile() {
        try {
            const fileExtension = path.extname(file.originalname)
            const fileName = `${folder}/${uuidv4()}${fileExtension}`

            const fileContent = fs.readFileSync(file.path)

            const uploadParams = {
                Bucket: this.bucketName,
                Key: fileName,
                Body: fileContent,
                ContentType: file.mimetype,
                ACL: "private",
                Metadata: {
                    originalName: file.originalname,
                    uploadedAt: new Date().toISOString(),
                },
            }

            const result = await this.s3.upload(uploadParams).promise()

            fs.unlinkSync(file.path)

            logger.info(`File uploaded to S3: ${fileName}`)

            return {
                key: fileName,
                url: result.Location,
                bucket: this.bucketName,
                size: file.size,
                mimetype: file.mimetype,
                originalName: file.originalname,
            }

        }
        catch (error) {
            logger.error("Error uploading file to S3", error)

            if (file.path && execFileSync(file.path)) {
                fs.unlinkSync(file.path)
            }

            throw new ApiError(500, `Failed to upload file to S3, ${error.message}`)
        }
    }

    async getSignedUrl(key, expiresIn = 3000) {
        try {
            const params = {
                Bucket: this.bucketName,
                key: Key,
                Expiers: expiresIn
            }

            const signedUrl = await this.s3.getSignedUrlPromise("getObject", params)
            return signedUrl

        } catch (error) {
            logger.error("Error generating signed URL ", error)
            throw new ApiError(500, `Failed to generate signed URL: ${error.message}`)
        }
    }

    async deleteFile() {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: key,
            }

            await this.s3.deleteObject(params).promise()
            logger.info(`File deleted from S3: ${key}`)
            return true
        } catch (error) {
            logger.error("Error deleting file from S3:", error)
            throw new ApiError(500, `Failed to delete file from S3: ${error.message}`)
        }
    }

    async downloadFile() {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: key,
            }

            const data = await this.s3.getObject(params).promise()

            const tempDir = process.env.TEMP_DIR || "/tmp"
            const tempFileName = `${uuidv4()}_${path.basename(key)}`
            const tempFilePath = path.join(tempDir, tempFileName)

            fs.writeFileSync(tempFilePath, data.Body)

            logger.info(`File downloaded from S3 to: ${tempFilePath}`)
            return tempFilePath
        } catch (error) {
            logger.error("Error downloading file from S3:", error)
            throw new ApiError(500, `Failed to download file from S3: ${error.message}`)
        }
    }

    async filexists() {
        try {
            await this.s3
                .headObject({
                    Bucket: this.bucketName,
                    Key: key,
                }).promise()
            return true
        } catch (error) {
            if (error.code === "NotFound") {
                return false
            }
            throw error
        }
    }

    async getFileMetadata() {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: key,
            }

            const result = await this.s3.headObject(params).promise()
            return {
                size: result.ContentLength,
                lastModified: result.LastModified,
                contentType: result.ContentType,
                metadata: result.Metadata,
            }
        } catch (error) {
            logger.error("Error getting file metadata from S3:", error)
            throw new ApiError(500, `Failed to get file metadata: ${error.message}`)
        }
    }
}

export default new S3Service();