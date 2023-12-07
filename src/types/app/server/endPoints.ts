// This is the type for an object which stores the detail of all available routes
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

export { END_POINTS, AVAILABLE_ROUTE, END_POINT_DETAIL };
