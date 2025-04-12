export const CONFIG = {
  uuidNameSpace: process.env.UUID_NAMESPACE || '',
  deployment: process.env.DEPLOYMENT,
  environment: process.env.ENVIRONMENT,
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY || '',
  cosmos: {
    connectionString: process.env.COSMOS_CONNECTION_STRING || '',
    database: process.env.COSMOS_DATABASE || 'db',
  },
  slackHook: process.env.SLACK_HOOK || '',
};
