function getKeyFromURL(URL) {
  if (!URL) return null;

  const baseURL = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

  return URL.replace(baseURL, "");
}

module.exports = getKeyFromURL;
