import Joi from "joi"

const validateJobData = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    company: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(50).max(5000).required(),
    requirements: Joi.array().items(Joi.string()).optional(),
    responsibilities: Joi.array().items(Joi.string()).optional(),
    benefits: Joi.array().items(Joi.string()).optional(),
    location: Joi.string().min(2).max(100).required(),
    type: Joi.string().valid("full-time", "part-time", "contract", "internship", "freelance").required(),
    experience: Joi.string().valid("entry", "mid", "senior", "executive").required(),
    remote: Joi.boolean().default(false),
    salary: Joi.object({
      min: Joi.number().min(0).optional(),
      max: Joi.number().min(0).optional(),
      currency: Joi.string().default("USD"),
      period: Joi.string().valid("hourly", "monthly", "yearly").default("yearly"),
    }).optional(),
    skills: Joi.array().items(Joi.string()).optional(),
    department: Joi.string().optional(),
    applicationDeadline: Joi.date().optional(),
    startDate: Joi.date().optional(),
  })

  return schema.validate(data)
}

export { validateJobData }