# do not import all endpoints into this module because that uses a lot of memory and stack frames
# if you need the ability to import all endpoints from this module, import them with
# from python_pydantic_response_as_param.paths.retrieve_equipment import Api

from python_pydantic_response_as_param.paths import PathValues

path = PathValues.RETRIEVEEQUIPMENT