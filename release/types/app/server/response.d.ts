type INTERNAL_FORMATTED_RESPONSE = {
    status: number;
    body: any;
    headers: any;
};
type RESPONSE = {
    status?: number;
    body: any;
    headers?: any;
};
export { INTERNAL_FORMATTED_RESPONSE, RESPONSE };
