# do not import all endpoints into this module because that uses a lot of memory and stack frames
# if you need the ability to import all endpoints from this module, import them with
# from python_pydantic_nested_union_with_list_and_str.apis.path_to_api import path_to_api

import enum


class PathValues(str, enum.Enum):
    SIMPLEENDPOINT = "/simple-endpoint"
