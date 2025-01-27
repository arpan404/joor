type LOGGER_NAME = string;
type LOGGER_PATH = string;
type LOGGER_LEVEL = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
type LOGGER_TIMESTAMP = string;
type LOGGER_MESSAGE = string;
type LOGGER_MESSAGE_TO_LOG = string;

// call back is responsible for formatting the log message, which can be set by the users.
type LOGGER_FORMAT_CALLBACK = (
  _timestamp: LOGGER_TIMESTAMP,
  _message: LOGGER_MESSAGE
) => LOGGER_MESSAGE_TO_LOG;

// config object that logger receives in the constructor must be of this type
interface LOGGER_CONFIG {
  name: LOGGER_NAME;
  path: LOGGER_PATH;
  formatCallBack: LOGGER_FORMAT_CALLBACK;
}

export { LOGGER_FORMAT_CALLBACK, LOGGER_CONFIG, LOGGER_LEVEL, LOGGER_MESSAGE, LOGGER_MESSAGE_TO_LOG, LOGGER_NAME, LOGGER_PATH, LOGGER_TIMESTAMP };
