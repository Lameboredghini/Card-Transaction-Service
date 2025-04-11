console.log(
  `${
    process.env.ENV
      ? "config loaded from env"
      : "config are required... please create .env and add all required env"
  }`
);
export const MM_CONFIG = {
  deployment: process.env.DEPLOYMENT,
  environment: process.env.ENVIRONMENT,
};
