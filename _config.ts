import lume from "lume/mod.ts";
import base_path from "lume/plugins/base_path.ts";
import esbuild from "lume/plugins/esbuild.ts";

const site = lume();

site.use(base_path());
site.use(esbuild());

export default site;