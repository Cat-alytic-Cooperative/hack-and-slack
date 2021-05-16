import { readdirSync, statSync } from "fs";
import { join, basename, extname } from "path";
import { Router, RequestHandler } from "express";

type DirectoryEntries = [string, string][];

function findRouteFiles(path: string, route: string) {
  const entries = readdirSync(path);

  const fileEntries: DirectoryEntries = [];
  entries.forEach((entry) => {
    const joinedPath = join(path, entry);
    let routeEntry = basename(entry, extname(entry));
    console.log(routeEntry);
    const parameterMatch = routeEntry.match(/^\[(.+)]$/);
    if (parameterMatch) {
      console.log("Parameter:", routeEntry);
      routeEntry = `:${parameterMatch[1]}`;
    }
    const joinedRoute = `${route}/${routeEntry}`; //join(route, routeEntry);
    console.log("joinedRoute", route, routeEntry, joinedRoute)
    if (statSync(joinedPath).isDirectory()) {
      fileEntries.push(...findRouteFiles(joinedPath, joinedRoute));
    } else {
      fileEntries.push([`${joinedRoute}`, joinedPath]);
    }
  });

  return fileEntries;
}

export const EXPRESS_METHODS = ["get", "put", "post", "delete", "head", "options", "patch", "all"];

export function initializeRouter(router: Router) {
  const routes = findRouteFiles(join(__dirname, "routes"), "");
  console.log(routes);

  const importPromises: Promise<any>[] = [];
  routes.forEach((entry) => {
    const [route, filename] = entry;
    let promise = import(filename)
      .then((module) => {
        EXPRESS_METHODS.forEach((method) => {
          if (module[method]) {
            const handlers: RequestHandler[] = Array.isArray(module[method]) ? module[method] : [module[method]];
            if (handlers.length === 0) {
              return console.log(`Route ${route} has no handlers.`);
            }
            console.log(`Configuring route ${route}#${method} with ${handlers.length - 1} middleware.`);
            return (router as any)[method](route, ...handlers);
          }
        });
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
    importPromises.push(promise);
  });
  return Promise.all(importPromises);
}
