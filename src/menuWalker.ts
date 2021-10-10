// Import Internals
import * as DokapiConfig from "./configuration";

export async function* walkDokapiMenu(location: string, menuList: DokapiConfig.DokapiMenu[]) {
  for (const { title, path } of menuList) {
    console.log(title, path);

    yield "foobar";
  }
}
