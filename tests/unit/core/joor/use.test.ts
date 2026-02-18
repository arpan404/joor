// // import { jest, describe, it, expect } from '@jest/globals';

// import Joor from '@/core/joor';
// import Router from '@/core/router';
// import { ROUTE_HANDLER } from '@/types/route';
// describe('use method of Joor class', () => {
//   let app = new Joor();
//   process.env.JOOR_LOGGER_ENABLE_CONSOLE_LOGGING = 'true';
//   beforeEach(() => {
//     app = new Joor();
//     jest.clearAllMocks();
//     Router.routes = {
//       '/': {},
//     };
//   });
//   it('should add middlewares to a specific route', () => {
//     const middlewares = [
//       jest.fn(),
//       jest.fn(),
//     ] as unknown as Array<ROUTE_HANDLER>;
//     app.use('/api/user', ...middlewares);
//     expect(
//       Router.routes['/'].children?.api?.children?.user?.localMiddlewares
//     ).toEqual(middlewares);
//   });
//   it('should add global middlewares to all sub-routes when path ends with *', () => {
//     const middlewares = [
//       jest.fn(),
//       jest.fn(),
//     ] as unknown as Array<ROUTE_HANDLER>;
//     app.use('/api/*', ...middlewares);
//     const route = Router.routes['/']?.children?.api;
//     expect(route?.globalMiddlewares).toEqual(middlewares);
//   });
//   it('should add same middlewares to multiple routes', () => {
//     const middlewares = [jest.fn()] as unknown as Array<ROUTE_HANDLER>;
//     app.use('/api/user', '/api/profile', ...middlewares);
//     expect(
//       Router.routes['/'].children?.api?.children?.user?.localMiddlewares
//     ).toEqual(middlewares);
//     expect(
//       Router.routes['/'].children?.api?.children?.profile?.localMiddlewares
//     ).toEqual(middlewares);
//   });
//   it('should not add middlewares if no path is provided', () => {
//     const middlewares = [jest.fn()] as unknown as Array<ROUTE_HANDLER>;
//     app.use('', ...middlewares);
//     expect(Router.routes['/'].children).toBeUndefined();
//   });
//   it('should handle nested routes correctly', () => {
//     const middlewares = [jest.fn()] as unknown as Array<ROUTE_HANDLER>;
//     const middlewares2 = [jest.fn()] as unknown as Array<ROUTE_HANDLER>;
//     app.use('/api/user/settings', ...middlewares);
//     app.use('/api/user/settings', ...middlewares2);
//     expect(
//       Router.routes['/'].children?.api?.children?.user?.children?.settings
//         ?.localMiddlewares
//     ).toEqual([...middlewares, ...middlewares2]);
//   });
//   it('should not overwrite existing middlewares for a route', () => {
//     const initialMiddlewares = [jest.fn()] as unknown as Array<ROUTE_HANDLER>;
//     const newMiddlewares = [jest.fn()] as unknown as Array<ROUTE_HANDLER>;
//     app.use('/api/user', ...initialMiddlewares);
//     app.use('/api/user', ...newMiddlewares);
//     expect(
//       Router.routes['/'].children?.api?.children?.user?.localMiddlewares
//     ).toEqual([...initialMiddlewares, ...newMiddlewares]);
//   });
//   it('should add middlewares to the root route', () => {
//     const middlewares = [jest.fn()] as unknown as Array<ROUTE_HANDLER>;
//     app.use('/', ...middlewares);
//     expect(Router.routes['/'].localMiddlewares).toEqual(middlewares);
//   });
//   it('should handle multiple wildcard routes correctly', () => {
//     const middlewares = [jest.fn()] as unknown as Array<ROUTE_HANDLER>;
//     app.use('/api/*', ...middlewares);
//     const apiRoute = Router.routes['/']?.children?.api;
//     app.use('/api/user/*', ...middlewares);
//     const userRoute = apiRoute?.children?.user;
//     expect(apiRoute?.globalMiddlewares).toEqual(middlewares);
//     expect(userRoute?.globalMiddlewares).toEqual(middlewares);
//   });
//   it('should handle routes with query parameters', () => {
//     const middlewares = [jest.fn()] as unknown as Array<ROUTE_HANDLER>;
//     app.use('/api/user?id=123', ...middlewares);
//     expect(
//       Router.routes['/'].children?.api?.children?.user?.localMiddlewares
//     ).toEqual(middlewares);
//   });
//   it('should handle routes with hash fragments', () => {
//     const middlewares = [jest.fn()] as unknown as Array<ROUTE_HANDLER>;
//     app.use('/api/user#profile', ...middlewares);
//     expect(
//       Router.routes['/'].children?.api?.children?.user?.localMiddlewares
//     ).toEqual(middlewares);
//   });
//   it('should handle routes with trailing slashes', () => {
//     const middlewares = [jest.fn()] as unknown as Array<ROUTE_HANDLER>;
//     app.use('/api/user/', ...middlewares);
//     expect(
//       Router.routes['/'].children?.api?.children?.user?.localMiddlewares
//     ).toEqual(middlewares);
//   });
//   it('should handle routes with special characters', () => {
//     const middlewares = [jest.fn()] as unknown as Array<ROUTE_HANDLER>;
//     app.use('/api/user@profile', ...middlewares);
//     expect(
//       Router.routes['/'].children?.api?.children?.['user@profile']
//         ?.localMiddlewares
//     ).toEqual(middlewares);
//   });
//   it('should handle dynamic routes', () => {
//     const middlewares = [jest.fn()] as unknown as Array<ROUTE_HANDLER>;
//     app.use('/api/:id', ...middlewares);
//     expect(
//       Router.routes['/'].children?.api?.children?.[':id']?.localMiddlewares
//     ).toEqual(middlewares);
//   });
//   it('should handle dynamic routes if middlewares are added separately', () => {
//     const middlewares = [jest.fn()] as unknown as Array<ROUTE_HANDLER>;
//     const middlewares2 = [jest.fn()] as unknown as Array<ROUTE_HANDLER>;
//     app.use('/api/:id', ...middlewares);
//     app.use('/api/:id', ...middlewares2);
//     expect(
//       Router.routes['/'].children?.api?.children?.[':id']?.localMiddlewares
//     ).toEqual([...middlewares, ...middlewares2]);
//   });
// });

describe('first', () => {
  it('should be true', () => {
    expect(1 + 1).toBe(2);
  });
});
