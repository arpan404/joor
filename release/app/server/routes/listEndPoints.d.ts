import { END_POINTS } from "../../../types/app/index.js";
/**
 * This function scans the whole directory inside 'app/routes/' folder of Joor App
 *
 * @returns Available Valid Routes
 *
 * The array returned from this function is used to check if the endpoint is valid or not.
 *
 * This function helps to load all possible routes in the initilization of server, which makes routing system faster than before.
 *
 */
export default function listEndPoints(): Promise<END_POINTS>;
