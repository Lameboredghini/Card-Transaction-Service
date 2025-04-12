export const CONFIG = {
  uuidNameSpace: process.env.UUID_NAMESPACE || '',
  deployment: process.env.DEPLOYMENT,
  environment: process.env.ENVIRONMENT,
  cosmos: {
    connectionString: process.env.COSMOS_CONNECTION_STRING || '',
    database: process.env.COSMOS_DATABASE || 'db',
  },
};
