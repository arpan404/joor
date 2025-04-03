import { ServerResponse } from "node:http";
import Jrror, { JoorError } from "@/core/error";
import { HeaderSent } from "@/core/error/response";
import logger from '@/helpers/joorLogger';

const response = ServerResponse.prototype;
response.status = function (this: ServerResponse, status: number) {
    try {
        if (this.headersSent) {
            throw HeaderSent;
        }
        if (!Number.isInteger(status)) {
            throw new Jrror({
                code: "response-status-invalid",
                message: `Status must be a integer number, but ${status} is provided.`,
                type: "error",
                docsPath: "/response",
            });
        }

        if (status < 100 || status > 999) {
            throw new Jrror({
                code: "response-status-invalid",
                message: `Status must be between 100 and 999, but ${status} is provided.`,
                type: "error",
                docsPath: "/response",
            });
        }
        this.statusCode = status;
    }
    catch (error: unknown) {
        if (error instanceof Jrror || error instanceof JoorError) {
            error.handle();
        }
        else {
            logger.error(error);
        }
    }
    finally {
        return this;
    }

}