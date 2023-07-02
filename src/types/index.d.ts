import type config from "@/config/config";
import type QUERY_TYPE from "@/common/CONSTANT/modules/QUERY_TYPE";

declare global {
  var $CONSTANT: {
    QUERY_TYPE: typeof QUERY_TYPE;
  };
  var $config: typeof config;
}
