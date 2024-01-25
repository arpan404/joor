type END_POINT_DETAIL = {
    route: string;
    filePath: string;
    isDynamic: boolean;
    type: "api" | "web";
    hasMiddleWare: boolean;
};
type AVAILABLE_ROUTE = {
    filePath: string;
    hasMiddleWare: boolean;
};
type END_POINTS = Array<END_POINT_DETAIL>;
export { END_POINTS, END_POINT_DETAIL, AVAILABLE_ROUTE };
