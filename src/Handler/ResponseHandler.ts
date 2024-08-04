import { Send, Response } from "express-serve-static-core";
import { ResponseCode } from "ezpzos.core";

export class ResponseHandler {
	/**
	 *
	 * @param {String} responseCode Constants.ResponseCode.*
	 * @param {String} info infromation message
	 * @param {JSON} data return data in JSON
	 * @returns String of response
	 */
	public static formatResponse(response: Response, responseCode: number, info: string, data: any) {
		switch (responseCode.toString()) {
			case ResponseCode.ACCESS_DENIED:
				this.formatErrorResponse(response, responseCode, "Access denied due to role permission.", info, data);
				break;
			case ResponseCode.BAD_REQUEST_BODY:
				this.formatErrorResponse(
					response,
					responseCode,
					"The data in request body is not well formed.",
					info,
					data
				);
				break;
			case ResponseCode.BAD_REQUEST_PARAMETERS:
				this.formatErrorResponse(
					response,
					responseCode,
					"The data in request parameters are not well formed.",
					info,
					data
				);
				break;
			case ResponseCode.RESOURCE_NOT_FOUND:
				this.formatErrorResponse(response, responseCode, "The resource is not found to action on.", info, data);
				break;
			case ResponseCode.TIMEOUT:
				this.formatErrorResponse(response, responseCode, "The lambda function timed out.", info, data);
				break;
			case ResponseCode.UNAUTHORISED:
				this.formatErrorResponse(
					response,
					responseCode,
					"Unauthorised to access the lambda function.",
					info,
					data
				);
				break;
			case ResponseCode.SUCCEED_OK:
				this.formateSuccessResponse(
					response,
					responseCode,
					"Request required, processed and returned successfully.",
					info,
					data
				);
				break;
			case ResponseCode.SUCCEED_CREATED:
				this.formateSuccessResponse(
					response,
					responseCode,
					"Request required, created and returned successfully.",
					info,
					data
				);
				break;
			case ResponseCode.SUCEED_ACCEPTED:
				this.formateSuccessResponse(
					response,
					responseCode,
					"The request is accepted but still processing.",
					info,
					data
				);
				break;
			case ResponseCode.SUCCEED_NO_CONTENT:
				this.formateSuccessResponse(
					response,
					responseCode,
					"PUT/POST/DELETE Done but returned no content.",
					info,
					data
				);
				break;
			case ResponseCode.NOT_IMPLEMENTED:
				this.formatErrorResponse(
					response,
					responseCode,
					"The lambda function is not currently in use.",
					info,
					data
				);
				break;
			case ResponseCode.SERVICE_REQUEST_FAILURE:
				this.formatErrorResponse(response, responseCode, "Internal service exception.", info, data);
				break;
			case ResponseCode.BAD_REQUEST:
				this.formatErrorResponse(response, responseCode, "Bad Request.", info, data);
				break;
		}
	}

	private static formatErrorResponse(
		response: Response,
		responseCode: number,
		errorMsg: string,
		info: string,
		data: any
	) {
		response.status(responseCode).send({
			statusCode: responseCode,
			error: errorMsg,
			info: info,
			data: data
		});
	}

	private static formateSuccessResponse(
		response: Response,
		responseCode: number,
		msg: string,
		info: string,
		data: any
	) {
		response.status(responseCode).send({
			statusCode: responseCode,
			message: msg,
			info: info,
			data: data
		});
	}
}
