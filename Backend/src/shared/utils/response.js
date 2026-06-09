export const sendResponse = (res, statusCode, success, message, data = {}) => {
    return res.status(statusCode).json({
        success,
        message,
        ...data
    });
};

export const sendResponses = (
  res,
  statusCode,
  success,
  message,
  data = null
) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};