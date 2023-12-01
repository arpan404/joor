// This is the type for an object which stores the detail of all available routes
type END_POINT_DETAIL = {
  route: string;
  filePath: string;
  isDynamic: string;
  type: "api" | "html" | "text";
  methodsAvailable: Array<"get" | "post" | "delete" | "put" | "patch">;
};

type END_POINTS = Array<END_POINT_DETAIL>;
export default END_POINTS;
