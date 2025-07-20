import AWS from "aws-sdk"
import { ApiError } from "../utils/apiError.js"
import logger from "../utils/logger.js"
import dotenv from "dotenv"
dotenv.config ()


class AWSConfig {
  constructor() {
    this.s3 = null
    this.bucketName = process.env.AWS_S3_BUCKET_NAME
    this.region = process.env.AWS_REGION || "us-east-1"

    this.initializeS3()
  }

  initializeS3() {
    try {
      AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: this.region,
      })

      this.s3 = new AWS.S3({
        apiVersion: "2006-03-01",
        region: this.region,
      })

      logger.info("AWS S3 configured successfully")
    } catch (error) {
      logger.error("Failed to configure AWS S3:", error)
      throw new ApiError(500, "Failed to configure AWS S3")
    }
  }

  getS3Instance() {
    if (!this.s3) {
      throw new ApiError(500, "S3 not initialized")
    }
    return this.s3
  }

  getBucketName() {
    if (!this.bucketName) {
      throw new ApiError(500, "S3 bucket name not configured")
    }
    return this.bucketName
  }

  async testConnection() {
    try {
      await this.s3.headBucket({ Bucket: this.bucketName }).promise()
      return true
    } catch (error) {
      logger.error("S3 connection test failed:", error)
      return false
    }
  }
}

export default new AWSConfig()
